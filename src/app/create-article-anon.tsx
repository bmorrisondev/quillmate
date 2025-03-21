'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@supabase/supabase-js'
import React from 'react'

function CreateArticleAnon() {

  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!)

  async function createArticle() {
    const { data, error } = await client.from('articles3').insert({
      title: 'Test anon article not using Clerk token',
      content: ''
    })

    if (error) {
      console.error(error)
    } else {
      console.log(data)
    }
  }

  return (
    <Button onClick={createArticle}>Create unauthorized article</Button>
  )
}

export default CreateArticleAnon