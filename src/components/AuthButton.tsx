"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase"
import { Button } from "@/components/ui/button"

export default function AuthButton() {
  const router = useRouter()

  const supabase = createClient()

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <Button onClick={handleSignIn} className="mt-4">
      Sign In with GitHub
    </Button>
  )
}

