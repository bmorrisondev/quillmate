import { create } from 'zustand'
import { type Article } from '@/lib/models'
import { type SupabaseClient } from '@supabase/supabase-js'

interface ArticleStore {
  articles: Article[]
  isLoading: boolean
  error: string | null
  fetchArticles: (supabase: SupabaseClient) => Promise<void>
  setArticles: (articles: Article[]) => void
  addArticle: (article: Article) => void
  updateArticle: (article: Article) => void
  deleteArticle: (id: string) => void
}

export const useArticleStore = create<ArticleStore>((set) => ({
  articles: [],
  isLoading: false,
  error: null,

  fetchArticles: async (supabase: SupabaseClient) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error

      set({ articles: data || [], isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch articles',
        isLoading: false 
      })
    }
  },

  setArticles: (articles) => set({ articles }),

  addArticle: (article) => 
    set((state) => ({ 
      articles: [article, ...state.articles] 
    })),

  updateArticle: (article) =>
    set((state) => ({
      articles: state.articles.map((a) => 
        a.id === article.id ? article : a
      )
    })),

  deleteArticle: (id) =>
    set((state) => ({
      articles: state.articles.filter((a) => a.id !== id)
    }))
}))