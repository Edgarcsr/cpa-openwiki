import { z } from 'zod'

import { ARTICLE_CATEGORIES } from '@/lib/article-categories'
import type { ArticleCategory } from '@/lib/article-categories'

const MAX_TITLE_LENGTH = 200
const MAX_SLUG_LENGTH = 100
const MAX_LABEL_LENGTH = 100
const MAX_VALUE_LENGTH = 500
const MAX_INFOBOX_ROWS = 30
const MAX_BODY_LENGTH = 100_000
const MAX_NOTE_LENGTH = 1000

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u

const CATEGORY_KEYS = Object.keys(ARTICLE_CATEGORIES) as [
  ArticleCategory,
  ...ArticleCategory[],
]

export const slugSchema = z.string().max(MAX_SLUG_LENGTH).regex(SLUG_PATTERN)

// O que a pessoa escreve no formulário. Vale igual no cliente e no servidor.
export const draftSchema = z.object({
  title: z.string().trim().min(1).max(MAX_TITLE_LENGTH),
  category: z.enum(CATEGORY_KEYS),
  infobox: z
    .array(
      z.tuple([
        z.string().trim().min(1).max(MAX_LABEL_LENGTH),
        z.string().trim().min(1).max(MAX_VALUE_LENGTH),
      ])
    )
    .max(MAX_INFOBOX_ROWS),
  body: z.string().trim().min(1).max(MAX_BODY_LENGTH),
  // Só se aplica quando há foto (existente ou nova).
  imageAlt: z.string().trim().max(MAX_TITLE_LENGTH).optional(),
})

export type ArticleDraft = z.infer<typeof draftSchema>

// Corpo do JSON enviado em POST /api/proposals (a foto vai como arquivo).
export const submissionSchema = z.object({
  kind: z.enum(['create', 'edit']),
  slug: slugSchema,
  draft: draftSchema,
  removeImage: z.boolean().optional(),
})

export type Submission = z.infer<typeof submissionSchema>

export const reviewSchema = z.object({
  action: z.enum(['approve', 'reject']),
  note: z.string().trim().max(MAX_NOTE_LENGTH).optional(),
})

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const IMAGE_TYPES = {
  'image/webp': 'webp',
  'image/png': 'png',
  'image/jpeg': 'jpg',
} as const

export type ImageExtension = (typeof IMAGE_TYPES)[keyof typeof IMAGE_TYPES]

export const IMAGE_MIME_BY_EXTENSION: Record<ImageExtension, string> = {
  webp: 'image/webp',
  png: 'image/png',
  jpg: 'image/jpeg',
}
