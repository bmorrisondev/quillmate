'use client'

import { Button } from "@/components/ui/button"
import { type Article } from '@/lib/models'
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useCallback, useEffect } from 'react'
import { extractTitleFromContent } from '@/lib/utils/content'
import { BlockNoteSchema, defaultInlineContentSpecs } from '@blocknote/core'
// import { Mention } from '@blocknote/extension-mention'

const schema = BlockNoteSchema.create({
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    // mention: Mention,
  },
});

interface BlockEditorProps {
  article: Article | null
  content: string
  onContentChange: (content: string) => void
  onSave: () => void
  isLoading?: boolean
  hasUnsavedChanges?: boolean
  isSaving?: boolean
}

export function BlockEditor({
  article,
  content,
  onContentChange,
  onSave,
  isLoading = false,
  hasUnsavedChanges = false,
  isSaving = false
}: BlockEditorProps) {
  // Create a new editor instance

  const editor = useCreateBlockNote({
    schema,
    initialContent: content ? JSON.parse(content) : undefined,
    // onEditorContentChange: (editor) => {
    //   // Convert blocks to HTML and update
    //   const html = editor.HTMLFromBlocks(editor.topLevelBlocks)
    //   onContentChange(html)
    // },
    domAttributes: {
      editor: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      }
    },
  })

  // useEffect(() => {
  //   if (editor && content) {
  //     try {
  //       // Try to parse content as JSON first (for existing BlockNote content)
  //       const blocks = JSON.parse(content)
  //       editor.replaceBlocks(editor.topLevelBlocks, blocks)
  //     } catch {
  //       // If parsing fails, assume it's HTML and convert
  //       const blocks = editor.HTMLToBlocks(content)
  //       editor.replaceBlocks(editor.topLevelBlocks, blocks)
  //     }
  //   }
  // }, [editor, content])

  // const addHeading = useCallback(() => {
  //   if (!editor) return
    
  //   editor.insertBlocks([{
  //     type: "heading",
  //     props: { level: 1 },
  //     content: "New Title"
  //   }], 0)
  // }, [editor])

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
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">{article.title}</h2>
          {hasUnsavedChanges && (
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              {isSaving ? 'Saving...' : 'Edited'}
            </span>
          )}
          {!extractTitleFromContent(content) && (
            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
              Missing H1 Title
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {/* <Button 
            variant="outline"
            size="sm"
            onClick={addHeading}
          >
            Add Title
          </Button> */}
          <Button 
            onClick={onSave}
            disabled={isLoading || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto border rounded-md">
        <BlockNoteView 
          editor={editor} 
          theme="light"
        />
      </div>
    </div>
  )
}
