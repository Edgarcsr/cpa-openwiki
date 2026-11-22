import { ARTICLE_CATEGORIES } from '@/lib/article-categories'
import type { ArticleCategory } from '@/lib/article-categories'

const COMBINING_MARKS = /[̀-ͯ]/gu
const NON_SLUG_CHARS = /[^a-z0-9]+/gu
const EDGE_DASHES = /^-+|-+$/gu
const PARAGRAPH_BREAK = /\n\s*\n/u
const LINK_TARGET = /\]\([^)]*\)/gu
const MARKDOWN_MARKS = /[*_`[]|^[-#\s]+/gu
const WHITESPACE = /\s+/gu
const MAX_SUMMARY_LENGTH = 200

// O resumo (cards e home) é o começo do artigo: o primeiro parágrafo, sem
// formatação e cortado numa palavra inteira.
export const deriveSummary = (body: string): string => {
  const paragraph =
    body
      .split(PARAGRAPH_BREAK)
      .find((block) => !block.trim().startsWith('#')) ?? ''
  const text = paragraph
    .replaceAll(LINK_TARGET, '')
    .replaceAll(MARKDOWN_MARKS, '')
    .replaceAll(WHITESPACE, ' ')
    .trim()
  if (text.length <= MAX_SUMMARY_LENGTH) {
    return text
  }
  const cut = text.slice(0, MAX_SUMMARY_LENGTH)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

export const slugify = (text: string): string =>
  text
    .normalize('NFD')
    .replaceAll(COMBINING_MARKS, '')
    .toLowerCase()
    .replaceAll(NON_SLUG_CHARS, '-')
    .replaceAll(EDGE_DASHES, '')

export const categoryLabel = (category: ArticleCategory) =>
  ARTICLE_CATEGORIES[category]
