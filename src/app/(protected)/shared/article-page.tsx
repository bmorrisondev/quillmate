'use client'
import { useParams } from 'next/navigation'
import { Editor } from '../components/editor'
import { useEffect, useState } from 'react'
import { Article } from '@/lib/models'
import { toast } from 'sonner'
import { useSupabase } from '@/lib/supabase-provider'
import { extractTitleFromContent } from '@/lib/utils/content'
import { useArticleStore } from '../store'

import ChatFAB from '../components/ChatFAB';

function ArticlePage() {
  const params = useParams()
  const [ isLoading, setIsLoading ] = useState(true)
  const { supabase } = useSupabase()
  const [article, setArticle] = useState<Article | null>(null)
  const { updateArticle } = useArticleStore()

  useEffect(() => {
    if (!params.articleId) return
    fetchArticle()
  }, [params.articleId])

  const fetchArticle = async () => {
    if (!supabase || !params.articleId) return

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', params.articleId)
      .single()

    if (error) {
      toast.error('Error fetching article')
      console.error('Error:', error)
      return
    }

    setArticle(data || null)
    setIsLoading(false)
  }

  const onSave = async (content: string) => {
    if (!supabase || !params.articleId || !article) return

    const title = extractTitleFromContent(content) || article.title

    const { error, data } = await supabase
      .from('articles')
      .update({ 
        content,
        title,
        updated_at: new Date().toISOString() 
      })
      .eq('id', params.articleId)
      .select()
      .single<Article>()

    if (data) {
      updateArticle(data)
    }

    if (error) {
      toast.error('Error updating article')
      console.error('Error:', error)
      return
    }
  }

  if(isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Editor
        article={article}
        onSave={onSave}  
      />
      {/* Mount the floating chat button */}
      {article && (
        <ChatFAB articleId={article.id} articleContent={article.content} />
      )}
    </>
  )
}

export default ArticlePage