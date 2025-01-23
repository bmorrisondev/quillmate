'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { type Article } from '@/lib/supabase'
import { toast } from 'sonner'
import { OrganizationSwitcher, useUser } from '@clerk/nextjs'
import { useSupabase } from '@/lib/supabase-provider'
import { useArticles } from '@/lib/hooks/use-articles'
import { Sidebar } from '@/components/sidebar'
import { Editor } from '@/components/editor'

export default function OrgPage({
  params
}: {
  params: { slug: string }
}) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [content, setContent] = useState('')
  const { user } = useUser()
  const { supabase } = useSupabase()
  const { articles, isLoading, fetchArticles } = useArticles()

  useEffect(() => {
    if (user) {
      fetchArticles()
    }
  }, [user, fetchArticles])

  useEffect(() => {
    if (selectedArticle) {
      setContent(selectedArticle.content)
    } else {
      setContent('')
    }
  }, [selectedArticle])

  const createNewArticle = async () => {
    if (!supabase) return

    const { data, error } = await supabase
      .from('articles')
      .insert([{ 
        title: 'New Article', 
        content: '# New Article\n\nStart writing here...' 
      }])
      .select(`
        *,
        creator:users!articles_created_by_fkey (
          first_name,
          last_name
        )
      `)
      .order('updated_at', { ascending: false })

    if (error) {
      toast.error('Error creating article')
      console.error('Error:', error)
      return
    }

    if (data && data[0]) {
      setSelectedArticle(data[0])
      await fetchArticles()
    }
  }

  const updateArticle = async () => {
    if (!supabase || !selectedArticle) return

    const { error } = await supabase
      .from('articles')
      .update({ 
        content,
        updated_at: new Date().toISOString() 
      })
      .eq('id', selectedArticle.id)

    if (error) {
      toast.error('Error updating article')
      console.error('Error:', error)
      return
    }

    toast.success('Article updated')
    await fetchArticles()
  }

  return (
    <div className="flex h-screen gap-4 p-4">
      {/* Left Pane - Article List */}
      <Sidebar
        articles={articles}
        isLoading={isLoading}
        selectedArticle={selectedArticle}
        onArticleSelect={setSelectedArticle}
        onNewArticle={createNewArticle}
        buttonText="New Article (ORG)"
      />

      {/* Middle Pane - Editor */}
      <Editor
        article={selectedArticle}
        content={content}
        onContentChange={setContent}
        onSave={updateArticle}
        isLoading={isLoading}
      />

      {/* Right Pane - AI Chat */}
      <div className="w-80 border-l pl-4">
        <h2 className="text-xl font-bold mb-4">AI Assistant</h2>
        <div className="text-gray-500">
          AI chat functionality coming soon...
        </div>
      </div>
    </div>
  )
}
