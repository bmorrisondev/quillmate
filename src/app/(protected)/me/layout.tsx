'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSupabase } from '@/lib/supabase-provider'
import { type Article } from '@/lib/models'
import { toast } from 'sonner'
import { Sidebar } from '../components/sidebar'
import { useArticleStore } from '../store'

function MeLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const { supabase } = useSupabase()
  const { fetchArticles } = useArticleStore()

  useEffect(() => {
    if(!supabase || !user) return
    fetchArticles(supabase)
  }, [user, supabase])

  return (
    <div className="flex h-screen">
      <Sidebar />
      { children }
    </div>
  )
}

export default MeLayout