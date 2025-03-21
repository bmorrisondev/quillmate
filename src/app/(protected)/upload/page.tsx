'use client'

import { useState } from 'react'
import { useSupabase } from '@/lib/supabase-provider'
import { useOrganization, useUser } from '@clerk/nextjs'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const { user } = useUser()
  const { organization } = useOrganization()
  const { supabase } = useSupabase()

  async function handleUpload() {
    if (!file) return
    if(!supabase) return

    try {
      setUploading(true)
      const key = organization?.id || user?.id
      const fileExt = file.name.split('.').pop()
      const fileName = `${key}/${Math.random()}.${fileExt}`
      const { error } = await supabase.storage
        .from('uploads')
        .upload(fileName, file)

      if (error) {
        throw error
      }

      alert('File uploaded successfully!')
      setFile(null)
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Upload File</h1>
      
      <div className="space-y-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={uploading}
        />
        
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-md
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  )
}