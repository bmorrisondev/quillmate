'use client'
import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react'; // Vercel AI SDK
import { PaperAirplaneIcon, XMarkIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { useUser } from '@clerk/nextjs';
import { useSupabase } from '@/lib/supabase-provider';
import { CoreMessage } from 'ai';


interface ChatFABProps {
  articleId: string;
  articleContent: string;
}

interface ChatMessage {
  id: string;
  article_id: string;
  user_id: string;
  message: string;
  role: 'user' | 'assistant';
  created_at: string;
}

export default function ChatFAB({ articleId, articleContent }: ChatFABProps) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const {supabase} = useSupabase();
  const { user } = useUser();

  // Vercel AI SDK
  const { messages, append, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [],
    body: {
      context: articleContent,
    },
  });

  // Fetch chat history from Supabase
  useEffect(() => {
    if (!open || !supabase) return;
    const fetchHistory = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('article_chats')
        .select('*')
        .eq('article_id', articleId)
        .order('created_at', { ascending: true });
      if (!error && data) setHistory(data);
      setLoading(false);
    };
    fetchHistory();
  }, [open, articleId, supabase]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [history, messages]);

  // Send message
  const handleSend = async () => {
    if (!input.trim() || !user || !supabase) return;
    setLoading(true);
    // Save user message
    const { data: userMsg, error: userError } = await supabase
      .from('article_chats')
      .insert({
        article_id: articleId,
        user_id: user.id,
        message: input,
        role: 'user',
      })
      .select()
      .single();
    if (userError) return setLoading(false);
    setHistory((prev) => [...prev, userMsg]);
    setInput('');

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [...messages, { role: 'user', content: input }],
      }),
    });
    const json = await response.json();

    // Save assistant message
    const { data: aiMsg, error: aiError } = await supabase
      .from('article_chats')
      .insert({
        article_id: articleId,
        user_id: user.id,
        message: json.messages[0].content[0].text,
        role: 'assistant',
      })
      .select()
      .single();
    if (!aiError) setHistory((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-12 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg focus:outline-none"
        style={{ display: open ? 'none' : 'block' }}
        aria-label="Open Chat"
      >
        <ChatBubbleOvalLeftEllipsisIcon className="h-7 w-7" />
      </button>
      {/* Chatbox */}
      {open && (
        <div className="fixed bottom-12 right-4 z-50 w-96 max-w-full bg-white rounded-lg shadow-2xl flex flex-col h-[500px] border">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="font-semibold">Chat about this article</span>
            <button onClick={() => setOpen(false)} aria-label="Close Chat">
              <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
            {loading ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : (
              history.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}>
                    {msg.message}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
          <form
            className="flex items-center gap-2 p-3 border-t"
            onSubmit={e => { e.preventDefault(); handleSend(); }}
          >
            <input
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask something about this article..."
              disabled={loading || isLoading}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2"
              disabled={loading || isLoading || !input.trim()}
              aria-label="Send"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
