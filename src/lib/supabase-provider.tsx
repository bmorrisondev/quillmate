'use client'

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useSession } from '@clerk/nextjs'
import { createContext, useContext, useEffect, useState } from 'react'

type SupabaseContext = {
  supabase: SupabaseClient | null
  isLoaded: boolean
}

const Context = createContext<SupabaseContext>({
  supabase: null,
  isLoaded: false
})

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = useSession()
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if(!session) return

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!, {
      accessToken: () => session?.getToken()
    })

    // const client = createClient(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //   process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    //   {
    //       accessToken: async () => {
    //           const clerkToken = await session?.getToken({
    //               template: 'supabase2',
    //           })
    //           return clerkToken ?? null
    //       },
    //   },
    // )

    setSupabase(client)
    setIsLoaded(true)
  }, [session])

  return (
    <Context.Provider value={{ supabase, isLoaded }}>
      {!isLoaded ? <div>Loading...</div> : children }
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return { 
    supabase: context.supabase,
    isLoaded: context.isLoaded
  }
}
