import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArticleHeader } from '@/components/article-header'
import { Infobox } from '@/components/infobox'
import { getArticle, listArticleSlugs } from '@/lib/article'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

// Todos os slugs são pré-renderizados, então a página já é estática. Isto só
// desliga o aviso de dev sobre ler `params` fora de <Suspense>.
export const instant = false

// Uma página estática por pasta em content/articles/.
export const generateStaticParams = () =>
  listArticleSlugs().map((slug) => ({ slug }))

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

  const { Content, title, image, infobox } = article

  return (
    <>
      <ArticleHeader title={title} slug={slug} />
      <Infobox title={title} image={image} rows={infobox} />
      <Content />
    </>
  )
}

export default ArticlePage
