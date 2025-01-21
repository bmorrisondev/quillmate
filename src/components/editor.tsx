import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { type Article } from '@/lib/supabase'

interface EditorProps {
  article: Article | null
  content: string
  onContentChange: (content: string) => void
  onSave: () => void
  isLoading?: boolean
}

export function Editor({
  article,
  content,
  onContentChange,
  onSave,
  isLoading = false
}: EditorProps) {
  if (!article) {
    return (
      <div className="flex-1 flex items-center justify-center h-full text-gray-500">
        Select an article or create a new one
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{article.title}</h2>
        <Button 
          onClick={onSave}
          disabled={isLoading}
        >
          Save
        </Button>
      </div>
      <Textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className="flex-1 resize-none font-mono"
        disabled={isLoading}
        placeholder="Start writing..."
      />
    </div>
  )
}
