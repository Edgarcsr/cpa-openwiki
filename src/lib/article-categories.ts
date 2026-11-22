// Fica separado de article.ts porque o formulário (client) também usa, e
// article.ts depende de node:fs.
export const ARTICLE_CATEGORIES = {
  member: 'Membro',
  event: 'Evento',
} as const

export type ArticleCategory = keyof typeof ARTICLE_CATEGORIES
