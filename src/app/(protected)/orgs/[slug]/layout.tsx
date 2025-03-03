'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSupabase } from '@/lib/supabase-provider'
import { Sidebar } from '../../components/sidebar'
import { useArticleStore } from '../../store'

function OrgLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const { supabase } = useSupabase()
  const { fetchArticles } = useArticleStore()

  useEffect(() => {
    if(!supabase || !user) return
    fetchArticles(supabase)
  }, [user, supabase])

  return (
    <div className="flex h-screen">
      <Sidebar includeUsernames />
      { children }
    </div>
  )
}

export default OrgLayout