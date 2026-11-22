import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArticleForm } from '@/components/article-form'
import { getArticle, listArticles } from '@/lib/article'

export const metadata: Metadata = { title: 'Editar página' }

// Mesmo motivo da página do artigo: `params` é lido na requisição.
export const instant = false

const EditPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) {
    notFound()
  }
  const all = await listArticles()

  return (
    <ArticleForm
      articles={all.map(({ slug: s, title }) => ({ slug: s, title }))}
      initial={{
        slug: article.slug,
        title: article.title,
        category: article.category,
        infobox: article.infobox,
        body: article.body,
        image: article.image,
      }}
    />
  )
}

export default EditPage
