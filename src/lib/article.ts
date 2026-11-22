import { cacheTag } from 'next/cache'

import type { ArticleCategory } from '@/lib/article-categories'
import { deriveSummary } from '@/lib/article-draft'
import { listArticleSlugs, readArticle } from '@/lib/store'

export { listArticleSlugs }

export interface ArticleImage {
  src: string
  alt: string
  width: number
  height: number
}

// Dados do artigo que as telas (cards, infobox, hover) usam.
export interface ArticleMetadata {
  title: string
  category: ArticleCategory
  summary: string
  // Opcional: artigos novos podem nascer sem foto.
  image?: ArticleImage
  infobox: [label: string, value: string][]
}

// Tag invalidada por revalidateTag('articles') sempre que um artigo é
// publicado, para as páginas refletirem a mudança sem rebuild.
export const ARTICLES_TAG = 'articles'

export const getArticle = async (slug: string) => {
  'use cache'
  cacheTag(ARTICLES_TAG)

  const article = await readArticle(slug)
  if (!article) {
    return null
  }

  const { record, body } = article
  const image: ArticleImage | undefined = record.image && {
    src: `/api/articles/${slug}/image?v=${encodeURIComponent(record.updatedAt)}`,
    alt: record.image.alt,
    width: record.image.width,
    height: record.image.height,
  }

  return {
    slug,
    body,
    updatedAt: record.updatedAt,
    title: record.title,
    category: record.category,
    summary: deriveSummary(body),
    image,
    infobox: record.infobox,
  }
}

export const listArticles = async () => {
  'use cache'
  cacheTag(ARTICLES_TAG)

  const slugs = await listArticleSlugs()
  const articles = await Promise.all(slugs.map((slug) => getArticle(slug)))
  return articles
    .filter((article) => article !== null)
    .toSorted((a, b) => a.title.localeCompare(b.title))
}
