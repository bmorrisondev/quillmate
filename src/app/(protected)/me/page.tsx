'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { type Article } from '@/lib/models'
import { toast } from 'sonner'
import { OrganizationSwitcher, useUser } from '@clerk/nextjs'
import { useSupabase } from '@/lib/supabase-provider'
import { useArticles } from '@/lib/hooks/use-articles'
import { Sidebar } from '@/components/sidebar'
import { BlockEditor } from '@/components/block-editor'
import { useDebouncedSave } from '@/lib/hooks/use-debounced-save'
import { extractTitleFromContent } from '@/lib/utils/content'
import { Editor } from '@/components/editor'

export default function AppPage() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [content, setContent] = useState('')
  const { user } = useUser()
  const { supabase } = useSupabase()
  const [ articles, setArticles ] = useState<Article[]>([])
  const [ isLoading, setIsLoading ] = useState(false)

  const fetchArticles = async () => {
    if (!supabase) return

    try {
      const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) {
        throw error
      }

      setArticles(articles || [])
    } catch (error) {
      toast.error('Error fetching articles')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchArticles()
    }
  }, [user])

  useEffect(() => {
    if (selectedArticle) {
      setContent(selectedArticle.content)
    } else {
      setContent('')
    }
  }, [selectedArticle])

  const createNewArticle = async () => {
    if (!supabase) return

    const defaultContent = '<h1>New Article</h1><p>Start writing here...</p>'
    const { data, error } = await supabase
      .from('articles')
      .insert([{ 
        title: 'New Article', 
        content: defaultContent
      }])
      .select()

    if (error) {
      toast.error('Error creating article')
      console.error('Error:', error)
      return
    }

    if (data && data[0]) {
      setSelectedArticle(data[0])
      setContent(defaultContent)
      await fetchArticles()
    }
  }

  const updateArticle = async () => {
    if (!supabase || !selectedArticle) return

    const title = extractTitleFromContent(content) || selectedArticle.title

    const { error } = await supabase
      .from('articles')
      .update({ 
        content,
        title,
        updated_at: new Date().toISOString() 
      })
      .eq('id', selectedArticle.id)

    if (error) {
      toast.error('Error updating article')
      console.error('Error:', error)
      return
    }

    await fetchArticles()
  }

  const { hasUnsavedChanges, isSaving } = useDebouncedSave(content, updateArticle)

  return (
    <div className="flex h-screen">
      {/* Left Pane - Article List */}
      <Sidebar
        articles={articles}
        isLoading={isLoading}
        selectedArticle={selectedArticle}
        onArticleSelect={setSelectedArticle}
        onNewArticle={createNewArticle}
        buttonText="New Article"
      />

      {/* Middle Pane - Editor */}
      <Editor
        article={selectedArticle}
        content={content}
        onContentChange={setContent}
        onSave={updateArticle}
        isLoading={isLoading}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
      />

      {/* Right Pane - AI Chat */}
      {/* <div className="w-80 border-l p-4">
        <h2 className="text-xl font-bold mb-4">AI Assistant</h2>
        <div className="text-gray-500">
          AI chat functionality coming soon...
        </div>
      </div> */}
    </div>
  )
}
