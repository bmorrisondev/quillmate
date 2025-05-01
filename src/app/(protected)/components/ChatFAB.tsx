'use client'
import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react'; // Vercel AI SDK
import { PaperAirplaneIcon, XMarkIcon, ChatBubbleOvalLeftEllipsisIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useUser, useAuth } from '@clerk/nextjs';
import { useSupabase } from '@/lib/supabase-provider';
import { CoreMessage } from 'ai';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';


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
  const { has } = useAuth();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const {supabase} = useSupabase();
  const { user } = useUser();

  useEffect(() => {
    if (has && has({ feature: 'ai_power' })) setIsPremium(true);
  }, [has]);

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
      
      {/* Subscription Modal */}
      {open && !isPremium && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="bg-blue-100 inline-flex p-3 rounded-full mb-4">
                <SparklesIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">Upgrade to Premium</h3>
              <p className="text-gray-600 mt-2">Chat with AI about articles is a premium feature</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 text-green-500">✓</div>
                <div className="ml-3">Ask questions about any article</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 text-green-500">✓</div>
                <div className="ml-3">Get explanations and summaries</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 text-green-500">✓</div>
                <div className="ml-3">Unlimited AI-powered conversations</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link 
                href="/subscribe" 
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-center"
              >
                Upgrade Now
              </Link>
              <button 
                onClick={() => setOpen(false)} 
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded text-center"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Chatbox */}
      {open && isPremium && (
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
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert overflow-hidden">
                        <ReactMarkdown>
                          {msg.message}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      msg.message
                    )}
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
