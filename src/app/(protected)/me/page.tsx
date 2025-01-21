'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { type Article } from '@/lib/supabase'
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'
import { OrganizationSwitcher, useUser } from '@clerk/nextjs'
import { useSupabase } from '@/lib/supabase-provider'
import { useArticles } from '@/lib/hooks/use-articles'

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

    const { data, error } = await supabase
      .from('articles')
      .insert([{ 
        title: 'New Article', 
        content: '# New Article\n\nStart writing here...' 
      }])
      .select()

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
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* Left Pane - Article List */}
      <div className="w-64 border-r pr-4 flex flex-col">
        <Button 
          onClick={createNewArticle}
          className="mb-4"
        >
          New Article (ORGS)
        </Button>
        <div className="overflow-y-auto flex-1">
          {isLoading ? (
            <div className="text-center text-gray-500">Loading articles...</div>
          ) : (
            articles.map((article) => (
              <div
                key={article.id}
                className={`p-2 mb-2 rounded cursor-pointer hover:bg-gray-100 ${
                  selectedArticle?.id === article.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => setSelectedArticle(article)}
              >
                <h3 className="font-medium truncate">{article.title}</h3>
                <p className="text-sm text-gray-500 truncate">
                  {new Date(article.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
        <OrganizationSwitcher
          hideSlug={false} // Allow users to customize the org's URL slug
          hidePersonal={false} // Allow users to select their personal account
          afterCreateOrganizationUrl="/orgs/:slug" // Navigate to the org's slug after creating an org
          afterSelectOrganizationUrl="/orgs/:slug" // Navigate to the org's slug after selecting  it
          afterSelectPersonalUrl="/me" // Navigate to the personal account after selecting it
        />
      </div>

      {/* Middle Pane - Editor */}
      <div className="flex-1 flex flex-col">
        {selectedArticle ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedArticle.title}</h2>
              <Button 
                onClick={updateArticle}
              >
                Save
              </Button>
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 resize-none font-mono"
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select an article or create a new one
          </div>
        )}
      </div>

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
