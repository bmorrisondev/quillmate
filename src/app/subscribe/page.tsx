import { __experimental_PricingTable } from '@clerk/nextjs'
import React from 'react'
import Link from 'next/link'

function SubscribePage() {
  return (
    <>
      {/* Navigation Bar */}
      <nav className="w-full px-4 py-3 flex items-center justify-between bg-white/70 dark:bg-gray-950/70 backdrop-blur-md fixed top-0 left-0 z-20 border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          ← Back to Home
        </Link>
      </nav>
      {/* Main Content */}
      <div className="flex min-h-svh items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 pt-20">
        <div className="flex flex-col items-center gap-8 p-8 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Unlock AI Superpowers
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Become a member to access exclusive AI features, priority support, and early access to new tools. Join our growing community and take your productivity to the next level!
        </p>
        <ul className="mb-4 w-full max-w-md mx-auto text-left text-base text-gray-700 dark:text-gray-200">
          <li className="flex items-center gap-2 mb-2">✅ <span>Unlimited AI queries and content generation</span></li>
          <li className="flex items-center gap-2 mb-2">✅ <span>Early access to new AI-powered features</span></li>
          <li className="flex items-center gap-2 mb-2">✅ <span>Priority email & chat support</span></li>
          <li className="flex items-center gap-2">✅ <span>Member-only resources and tutorials</span></li>
        </ul>
        <div className="mb-4">
          <span className="font-semibold text-lg text-blue-600 dark:text-blue-400">
            Ready to get started? Choose your plan below:
          </span>
          </div>
          <div className="w-full flex justify-center">
            <__experimental_PricingTable />
          </div>
        </div>
      </div>
    </>
  );
}

export default SubscribePage