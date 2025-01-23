import { createClient } from '@supabase/supabase-js'

export function getSupabaseClient(supabaseUrl?: string, supabaseKey?: string) {
  const url = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase URL or Key')
  }

  return createClient(url, key)
}

export type Article = {
  id: string
  title: string
  content: string
  owner_id: string
  created_at: string
  updated_at: string
  created_by: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
}
