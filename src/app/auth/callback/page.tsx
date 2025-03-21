'use client'

import { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

function Page() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!
    )

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Forward to success page
        router.push('/')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Completing sign in...</h2>
        <p className="text-gray-600">You will be redirected shortly.</p>
      </div>
    </div>
  )
}

export default Page