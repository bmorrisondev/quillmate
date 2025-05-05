'use client'

import { SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface SubscriptionModalProps {
  onClose: () => void;
}

export default function SubscriptionModal({ onClose }: SubscriptionModalProps) {
  return (
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
            onClick={onClose} 
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded text-center"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
