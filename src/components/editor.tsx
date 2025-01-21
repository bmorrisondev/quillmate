'use client'

import { Button } from "@/components/ui/button"
import { type Article } from '@/lib/supabase'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Image from '@tiptap/extension-image'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import {common, createLowlight} from 'lowlight'
import { extractTitleFromContent } from '@/lib/utils/content'
import { uploadFile } from '@/lib/utils/upload'
import { useSupabase } from '@/lib/supabase-provider'
import { toast } from 'sonner'

const lowlight = createLowlight(common)

interface EditorProps {
  article: Article | null
  content: string
  onContentChange: (content: string) => void
  onSave: () => void
  isLoading?: boolean
  hasUnsavedChanges?: boolean
  isSaving?: boolean
}

export function Editor({
  article,
  content,
  onContentChange,
  onSave,
  isLoading = false,
  hasUnsavedChanges = false,
  isSaving = false
}: EditorProps) {
  const { supabase } = useSupabase()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
      Link.configure({
        openOnClick: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  const addLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor || !supabase) return

    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Show loading state
      const tempUrl = URL.createObjectURL(file)
      editor.chain().focus().setImage({ src: tempUrl }).run()

      // Upload file
      const publicUrl = await uploadFile(supabase, file)

      // Replace temp URL with actual URL
      const doc = editor.state.doc
      doc.descendants((node, pos) => {
        if (node.type.name === 'image' && node.attrs.src === tempUrl) {
          editor.chain().setNodeSelection(pos).updateAttributes('image', {
            src: publicUrl,
          }).run()
          return false
        }
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload image')
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [editor, supabase])

  if (!article) {
    return (
      <div className="flex-1 flex items-center justify-center h-full text-gray-500">
        Select an article or create a new one
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
      />
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
          <Button 
            variant="outline"
            size="sm"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            disabled={!editor?.can().chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor?.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          >
            H1
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor?.can().chain().focus().toggleBold().run()}
            className={editor?.isActive('bold') ? 'is-active' : ''}
          >
            bold
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor?.can().chain().focus().toggleItalic().run()}
            className={editor?.isActive('italic') ? 'is-active' : ''}
          >
            italic
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => editor?.chain().focus().toggleCode().run()}
            disabled={!editor?.can().chain().focus().toggleCode().run()}
            className={editor?.isActive('code') ? 'is-active' : ''}
          >
            code
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={addLink}
            className={editor?.isActive('link') ? 'is-active' : ''}
          >
            link
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            image
          </Button>
          <Button 
            onClick={onSave}
            disabled={isLoading || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
      <EditorContent 
        editor={editor} 
        className="flex-1 overflow-y-auto border rounded-md p-4"
        disabled={isLoading}
      />
    </div>
  )
}
