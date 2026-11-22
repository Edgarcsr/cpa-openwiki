import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArticleBody } from '@/components/article-body'
import { ArticleHeader } from '@/components/article-header'
import { Infobox } from '@/components/infobox'
import { getArticle, listArticleSlugs } from '@/lib/article'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

// Artigos novos entram em runtime (sem rebuild), então `params` é lido na
// requisição. Isto desliga o aviso de dev sobre ler `params` fora de <Suspense>.
export const instant = false

// Pré-renderiza os artigos que já existem; os demais são gerados sob demanda.
export const generateStaticParams = async () => {
  const slugs = await listArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export const generateMetadata = async ({
  params,
}: ArticlePageProps): Promise<Metadata> => {
  const { slug } = await params
  const article = await getArticle(slug)
  return { title: article?.title }
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const { body, title, image, infobox } = article

  return (
    <>
      <ArticleHeader title={title} slug={slug} />
      <Infobox title={title} image={image} rows={infobox} />
      <ArticleBody body={body} />
    </>
  )
}

export default ArticlePage
