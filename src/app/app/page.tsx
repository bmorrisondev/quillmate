'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from '@/lib/supabase'
import { type Article } from '@/lib/supabase'
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'
import { useSession, useUser } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'

export default function AppPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [content, setContent] = useState('')
  const { session } = useSession()
  const { user } = useUser()

  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        global: {
          // Get the custom Supabase token from Clerk
          fetch: async (url, options = {}) => {
            const clerkToken = await session?.getToken({
              template: 'supabase',
            })

            // Insert the Clerk Supabase token into the headers
            const headers = new Headers(options?.headers)
            headers.set('Authorization', `Bearer ${clerkToken}`)

            // Now call the default fetch
            return fetch(url, {
              ...options,
              headers,
            })
          },
        },
      },
    )
  }

  const supabase = createClerkSupabaseClient()

  useEffect(() => {
    if(user) {
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

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Error fetching articles')
      console.error('Error:', error)
      return
    }

    setArticles(data || [])
  }

  const createNewArticle = async () => {
    const { data, error } = await supabase
      .from('articles')
      .insert([{ 
        title: 'New Article', 
        content: '# New Article\n\nStart writing here...' 
      }])
      .select()

    console.log(data, error)

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
    if (!selectedArticle) return

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
          New Article
        </Button>
        <div className="overflow-y-auto flex-1">
          {articles.map((article) => (
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
          ))}
        </div>
      </div>

      {/* Middle Pane - Editor */}
      <div className="flex-1 flex flex-col">
        {selectedArticle ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedArticle.title}</h2>
              <Button onClick={updateArticle}>Save</Button>
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
