'use client'
import { useState, useEffect } from 'react';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@clerk/nextjs';
import SubscriptionModal from './SubscriptionModal';
import ChatInterface from './ChatInterface';

interface ChatFABProps {
  articleId: string;
  articleContent: string;
}

export default function ChatFAB({ articleId, articleContent }: ChatFABProps) {
  const { has } = useAuth();
  const [open, setOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (has && has({ feature: 'ai_assistant' })) setIsPremium(true);
  }, [has]);
  
  const handleClose = () => setOpen(false);

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
        <SubscriptionModal onClose={handleClose} />
      )}
      
      {/* Chatbox */}
      {open && isPremium && (
        <ChatInterface
          onClose={handleClose}
          articleId={articleId}
          articleContent={articleContent}
        />
      )}
    </>
  );
}
