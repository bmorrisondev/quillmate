import { Button } from "@/components/ui/button"
import { type Article } from '@/lib/supabase'

interface ArticleListProps {
  articles: Article[]
  isLoading: boolean
  isLoaded: boolean
  selectedArticle: Article | null
  onArticleSelect: (article: Article) => void
  onNewArticle: () => void
  buttonText?: string
}

export function ArticleList({
  articles,
  isLoading,
  isLoaded,
  selectedArticle,
  onArticleSelect,
  onNewArticle,
  buttonText = "New Article"
}: ArticleListProps) {
  return (
    <div className="w-64 border-r pr-4 flex flex-col">
      <Button 
        onClick={onNewArticle}
        className="mb-4"
        disabled={!isLoaded}
      >
        {buttonText}
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
              onClick={() => onArticleSelect(article)}
            >
              <h3 className="font-medium truncate">{article.title}</h3>
              <p className="text-sm text-gray-500 truncate">
                {new Date(article.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
