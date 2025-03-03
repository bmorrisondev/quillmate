'use client'

import { type Article } from '@/lib/models'
import "@blocknote/core/fonts/inter.css"
import { useCreateBlockNote } from "@blocknote/react"
import "@blocknote/react/style.css"
import { useCallback, useEffect, useRef, useState } from 'react'
import { extractTitleFromContent } from '@/lib/utils/content'
import { uploadFile } from '@/lib/utils/upload'
import { useSupabase } from '@/lib/supabase-provider'
import { toast } from 'sonner'
import { BlockNoteView } from "@blocknote/shadcn"
import { useDebouncedSave } from '@/lib/hooks/use-debounced-save'
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

interface EditorProps {
  article: Article | null
  onSave: (content: string) => Promise<void>
}

export function Editor({ article, onSave }: EditorProps) {
  const { supabase } = useSupabase()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [content, setContent] = useState(article?.content || '')
  const [title, setTitle] = useState(article?.title || '')
  const { hasUnsavedChanges, isSaving } = useDebouncedSave(content, onSave)
  const [wordCount, setWordCount] = useState(0)

  // Create editor instance
  const editor = useCreateBlockNote({
  });
  
  // const editor = useBlockNote({
  //   initialContent: content ? JSON.parse(content) : undefined,
  //   onEditorContentChange: (editor) => {
  //     // Convert to HTML for compatibility with existing system
  //     const htmlContent = editor.HTMLContent
  //     onContentChange(htmlContent)
  //   },
  //   uploadFile: async (file) => {
  //     try {
  //       const publicUrl = await uploadFile(supabase, file)
  //       return publicUrl
  //     } catch (error) {
  //       console.error('Error uploading file:', error)
  //       toast.error('Failed to upload image')
  //       return null
  //     }
  //   },
  // })

  useEffect(() => {
    if(!editor || !article) return
    async function loadContent() {
      if (article?.content) {
        console.log(article?.content)
        try {
          const parsedContent = JSON.parse(article?.content)
          editor.replaceBlocks(editor.document, parsedContent)
        } catch {
          // If content is HTML (legacy), handle accordingly
          // editor.HTMLContent = content
          const blocks = await editor.tryParseHTMLToBlocks(article?.content)
          editor.replaceBlocks(editor.document, blocks)
        }
      }
    }
    loadContent()
  }, [editor, article])

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !editor) return

    try {
      throw new Error("Not implemented")
      // const publicUrl = await uploadFile(supabase, file)
      // if (publicUrl) {
      //   editor.insertBlocks([
      //     {
      //       type: "image",
      //       props: { url: publicUrl }
      //     }
      //   ], editor.getTextCursorPosition().block, "after")
      // }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload image')
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [editor, supabase])

  useEffect(() => {
    if(!editor) return
    async function parseWordCount() {
      const markdown = await editor.blocksToMarkdownLossy(editor.document)
      // Split by whitespace and filter out empty strings
      const words = markdown.split(/\s+/).filter(Boolean)
      setWordCount(words.length)
    }
    parseWordCount()
  }, [editor, content])

  function handleContentChange(): void {
    setContent(JSON.stringify(editor.document))
  }

  return (
    <div className='flex flex-col flex-1'>
      <BlockNoteView 
        editor={editor} 
        onChange={handleContentChange}
        theme="light"
        className="flex-1 overflow-y-auto p-4 w-100"
        />
      <div className='flex gap-2 justify-between p-2 bg-gray-50 border-t'>
        <div className='text-sm text-gray-500'>
          {wordCount} words
        </div>
        {hasUnsavedChanges && (
          <div className='text-sm'>
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              {isSaving ? 'Saving...' : 'Edited'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
