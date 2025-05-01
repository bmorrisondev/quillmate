import { SignedIn, SignedOut, Waitlist } from "@clerk/nextjs"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FeaturesGrid } from "@/components/features-grid"

export default async function Page() {

  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="flex flex-col items-center gap-8 p-8 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Quillmate</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Your AI-Powered Collaborative Writing Assistant</p>
        <FeaturesGrid />
        <div className="mt-8">
          <SignedOut>
            <div className="flex flex-col gap-4 items-center">
              <Waitlist />
            </div>
          </SignedOut>
          <SignedIn>
            <Link
              href="/me"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity">
              Go to App <ArrowRight className="w-4 h-4" />
            </Link>
          </SignedIn>
        </div>
      </div>
    </div>
  )
}

