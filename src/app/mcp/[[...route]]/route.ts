import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { TextEncoder } from 'util';
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const server = new McpServer({
  name: "quillmate-server",
  version: "0.0.1",
});

const sayHelloSchema = {
  name: z.string()
}

server.tool("say-hello", sayHelloSchema, async ({ name }) => ({
  content: [{ type: "text", text: `Hello ${name}!` }]
}));

const encoder = new TextEncoder();

const transports: Record<string, SSEServerTransport> = {};

export async function GET(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname.startsWith('/mcp/register')) {
    console.log(`GET request received for MCP registration. URL: ${req.url}`);
    try {
      const stream = new TransformStream();
      const writer = stream.writable.getWriter();

      const transport = new SSEServerTransport('/mcp/message', writer);
      const sessionId = transport.sessionId;
      console.log(`SSEServerTransport created with sessionId: ${sessionId}`);

      transports[sessionId] = transport;
      console.log(`Transport stored for sessionId: ${sessionId}`);

      req.signal.addEventListener('abort', () => {
        console.log(`Client disconnected (abort signal) for sessionId: ${sessionId}. Cleaning up.`);
        transport.close();
        delete transports[sessionId];
        console.log(`Transport removed for sessionId: ${sessionId}`);
      });

      await server.connect(transport);
      console.log(`McpServer connected successfully via SSEServerTransport for sessionId: ${sessionId}`);

      return new Response(stream.readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
        },
        status: 200
      });

    } catch (error) {
      console.error("Error setting up MCP SSE stream with SSEServerTransport:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      const transportToRemove = Object.values(transports).find(t => !t.isClosed);
      if (transportToRemove) {
        console.warn(`Cleaning up potentially orphaned transport: ${transportToRemove.sessionId}`);
        transportToRemove.close();
        delete transports[transportToRemove.sessionId];
      }
      return NextResponse.json({ error: 'Failed to create MCP SSE stream', details: errorMessage }, { status: 500 });
    }
  }

  console.log(`Unhandled GET request: ${url.pathname}`);
  return new NextResponse('Not found', { status: 404 });
}

export async function POST(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname.startsWith('/mcp/message')) {
    const sessionId = url.searchParams.get('sessionId');
    console.log(`POST request received for MCP message. SessionId from query: ${sessionId}`);

    if (!sessionId) {
      console.warn('POST /mcp/message: No session id provided in query params.');
      return new NextResponse('No session id provided in query parameters', { status: 400 });
    }

    const transport = transports[sessionId];

    if (transport) {
      if (transport.isClosed) {
        console.log(`POST /mcp/message: Transport found but already closed for sessionId: ${sessionId}`);
        delete transports[sessionId];
        return new NextResponse('Session expired or closed', { status: 410 });
      }
      try {
        console.log(`POST /mcp/message (sessionId: ${sessionId}): Delegating to transport handler.`);
        const response = await transport.handlePostRequest(req);
        console.log(`POST /mcp/message (sessionId: ${sessionId}): Transport handler finished.`);
        return response || new NextResponse('OK', { status: 200 });
      } catch (error) {
        console.error(`POST /mcp/message (sessionId: ${sessionId}): Error during transport handling:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to process message';
        return new NextResponse(errorMessage, { status: 500 });
      }
    } else {
      console.log(`POST /mcp/message: No active transport found for sessionId: ${sessionId}`);
      return new NextResponse('Invalid or expired session ID', { status: 404 });
    }
  }

  console.log(`Unhandled POST request: ${url.pathname}`);
  return new NextResponse('Not found', { status: 404 });
}
