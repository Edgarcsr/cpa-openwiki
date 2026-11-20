import { readdirSync } from 'node:fs'
import path from 'node:path'

import type { StaticImageData } from 'next/image'
import type { ComponentType } from 'react'

// Dados que cada artigo exporta no próprio .mdx (`export const metadata`).
export interface ArticleMetadata {
  title: string
  category: 'member' | 'event'
  summary: string
  image: { src: StaticImageData; alt: string }
  infobox: [label: string, value: string][]
}

interface ArticleModule {
  default: ComponentType
  metadata: ArticleMetadata
}

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

// Cada pasta em content/articles/ é um artigo; o nome da pasta é o slug.
export const listArticleSlugs = (): string[] =>
  readdirSync(ARTICLES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map(({ name }) => name)

export const getArticle = async (slug: string) => {
  // Só importa slugs que existem de fato (também evita caminhos estranhos).
  if (!listArticleSlugs().includes(slug)) {
    return null
  }

  const article: ArticleModule = await import(
    `../../content/articles/${slug}/index.mdx`
  )

  return { slug, Content: article.default, ...article.metadata }
}
