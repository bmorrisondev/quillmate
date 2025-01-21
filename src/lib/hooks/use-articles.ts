import { useCallback, useState } from 'react'
import { useSupabase } from '../supabase-provider'
import { type Article } from '../supabase'
import { toast } from 'sonner'

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { supabase, isLoaded } = useSupabase()

  const fetchArticles = useCallback(async () => {
    if (!supabase || !isLoaded) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setArticles(data || [])
    } catch (error) {
      toast.error('Error fetching articles')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase, isLoaded])

  return {
    articles,
    isLoading,
    fetchArticles
  }
}
