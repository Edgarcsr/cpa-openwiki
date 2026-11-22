import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ArticleForm } from '@/components/article-form'
import { ArticleGlobe } from '@/components/article-globe'
import { PageShell } from '@/components/page-shell'
import { listArticles } from '@/lib/article'

export const metadata: Metadata = { title: 'Criar página' }

interface CreatePageProps {
  searchParams: Promise<{ slug?: string }>
}

// `?slug=` vem dos links vermelhos (páginas citadas que ainda não existem).
const FormWithInitialSlug = async ({ searchParams }: CreatePageProps) => {
  const { slug } = await searchParams
  const allArticles = await listArticles()
  const articles = allArticles.map((article) => ({
    slug: article.slug,
    title: article.title,
  }))

  return <ArticleForm articles={articles} initialSlug={slug} />
}

const CreatePage = ({ searchParams }: CreatePageProps) => (
  <>
    <PageShell>
      <Suspense fallback={null}>
        <FormWithInitialSlug searchParams={searchParams} />
      </Suspense>
    </PageShell>
    <ArticleGlobe />
  </>
)

export default CreatePage
