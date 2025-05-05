import { CoreMessage, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { has } = await auth()

  if(!has({ feature: 'ai_assistant' })) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { messages }: { messages: CoreMessage[] } = await req.json();

  const { response } = await generateText({
    model: openai('gpt-4'),
    system: 'You are a helpful assistant. Format all responses as markdown.',
    messages,
  });

  return NextResponse.json({ messages: response.messages });
}