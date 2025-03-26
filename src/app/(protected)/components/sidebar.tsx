'use client'

import { Button } from "@/components/ui/button"
import { type Article } from '@/lib/models'
import { OrganizationSwitcher, useOrganization, UserButton, useUser } from '@clerk/nextjs'
import Link from "next/link"
import { useSupabase } from "@/lib/supabase-provider"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useArticleStore } from "../store"

interface SidebarProps {
  showOrgSwitcher?: boolean
}

type NewArticle = Pick<Article, 'title' | 'content' | 'owner_id'>

export function Sidebar({ showOrgSwitcher = true }: SidebarProps) {
  const { user } = useUser()
  const { organization } = useOrganization()
  const { supabase } = useSupabase()
  const router = useRouter()
  const { articles, isLoading, addArticle } = useArticleStore()

  async function onNewArticleClicked() {
    if (!supabase || !user) return

    const newArticle: NewArticle = {
      title: 'New Article',
      content: '',
      owner_id: organization?.id ?? user.id
    }

    const { error, data } = await supabase
      .from('articles')
      .insert(newArticle)
      .select()
      .single<Article>()

    if (error) {
      toast.error('Failed to create new article')
    } else {
      router.push(`${organization ? `/orgs/${organization.slug}` : '/me'}/${data.id}`)
      addArticle(data)
    }
  }

  return (
    <div className="w-64 border-r p-4 flex flex-col">
      <div className="flex items-center gap-2 pb-2">
        <UserButton showName />
      </div>
      <Button onClick={onNewArticleClicked} className="mb-4">
        New Article
      </Button>
      <div className="overflow-y-auto flex-1 flex flex-col">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading articles...</div>
        ) : (
          articles.map((article) => (
            <Link
              key={article.id}
              href={`${organization ? `/orgs/${organization.slug}` : '/me'}/${article.id}`}
              className="px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100"
            >
              <h3 className="font-medium">{article.title || 'Untitled'}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{new Date(article.updated_at).toLocaleDateString()}</span>
                {article.first_name && (
                  <>
                    <span>•</span>
                    <span>
                      {article.first_name} {article.last_name}
                    </span>
                  </>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
      {showOrgSwitcher && (
        <OrganizationSwitcher
          hideSlug={false}
          hidePersonal={false}
          afterCreateOrganizationUrl="/orgs/:slug"
          afterSelectOrganizationUrl="/orgs/:slug"
          afterSelectPersonalUrl="/me"
        />
      )}
    </div>
  )
}
