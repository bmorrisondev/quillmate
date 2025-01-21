import Auth from "@/components/Auth"
import ItemList from "@/components/ItemList"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import Link from "next/link"

export default async function Page() {

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold">Quillmate Supabase</h1>
        <SignedOut>
          <Link href="/sign-in">Sign In</Link>
        </SignedOut>
        <SignedIn>
          <Link href="/app">Go to App</Link>
        </SignedIn>
      </div>
    </div>
  )
}

