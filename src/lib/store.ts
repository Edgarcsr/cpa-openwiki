import 'server-only'
import { randomUUID } from 'node:crypto'
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'

import { imageSize } from 'image-size'

import type { ArticleCategory } from '@/lib/article-categories'
import {
  IMAGE_MIME_BY_EXTENSION,
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  SLUG_PATTERN,
} from '@/lib/article-schema'
import type { ArticleDraft, ImageExtension } from '@/lib/article-schema'
import type { ProposalStatus } from '@/lib/store-types'

// Tudo que o wiki guarda fica em content/ (artigos e propostas). É essa pasta
// que o botão de exportar baixa.
export const CONTENT_DIR = path.join(process.cwd(), 'content')
export const ARTICLES_DIR = path.join(CONTENT_DIR, 'articles')
export const PROPOSALS_DIR = path.join(CONTENT_DIR, 'proposals')

const RECORD_FILE = 'article.json'
const BODY_FILE = 'body.md'
const PROPOSAL_FILE = 'proposal.json'
const IMAGE_BASENAME = 'foto'
const UUID_PATTERN = /^[0-9a-f-]{36}$/u
const IMAGE_FILE_PATTERN = /^foto\.(?<ext>webp|png|jpg)$/u

export class StoreError extends Error {
  readonly status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = 'StoreError'
    this.status = status
  }
}

export interface StoredImage {
  file: string
  width: number
  height: number
}

export interface ArticleRecord {
  title: string
  category: ArticleCategory
  infobox: [label: string, value: string][]
  image?: StoredImage & { alt: string }
  updatedAt: string
}

export interface Proposal {
  id: string
  kind: 'create' | 'edit'
  slug: string
  authorId: string
  authorName: string
  createdAt: string
  status: ProposalStatus
  reviewedAt?: string
  reviewedBy?: string
  note?: string
  // `updatedAt` do artigo quando a proposta foi feita (detecta conflito).
  baseUpdatedAt?: string
  draft: ArticleDraft
  // Foto nova enviada junto da proposta.
  image?: StoredImage
  removeImage?: boolean
}

const readJson = async <T>(file: string): Promise<T | null> => {
  try {
    return JSON.parse(await readFile(file, 'utf-8')) as T
  } catch {
    return null
  }
}

const writeJson = (file: string, value: unknown) =>
  writeFile(file, `${JSON.stringify(value, null, 2)}\n`)

const listDirectories = async (dir: string): Promise<string[]> => {
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    return entries
      .filter((entry) => entry.isDirectory())
      .map(({ name }) => name)
  } catch {
    return []
  }
}

const assertSlug = (slug: string) => {
  if (!SLUG_PATTERN.test(slug)) {
    throw new StoreError('Endereço inválido.')
  }
}

const articleDir = (slug: string) => {
  assertSlug(slug)
  return path.join(ARTICLES_DIR, slug)
}

const proposalDir = (id: string) => {
  if (!UUID_PATTERN.test(id)) {
    throw new StoreError('Proposta inválida.', 404)
  }
  return path.join(PROPOSALS_DIR, id)
}

// --- Artigos -----------------------------------------------------------

export const listArticleSlugs = async (): Promise<string[]> => {
  const names = await listDirectories(ARTICLES_DIR)
  return names.filter((name) => SLUG_PATTERN.test(name))
}

export const readArticle = async (slug: string) => {
  if (!SLUG_PATTERN.test(slug)) {
    return null
  }
  const dir = articleDir(slug)
  const record = await readJson<ArticleRecord>(path.join(dir, RECORD_FILE))
  if (!record) {
    return null
  }
  const body = await readFile(path.join(dir, BODY_FILE), 'utf-8').catch(
    () => ''
  )
  return { record, body }
}

// Caminho e tipo da foto, validando o nome (só `foto.webp|png|jpg`).
const resolveImage = (dir: string, image?: StoredImage) => {
  if (!image || !IMAGE_FILE_PATTERN.test(image.file)) {
    return null
  }
  const extension = IMAGE_FILE_PATTERN.exec(image.file)?.groups
    ?.ext as ImageExtension
  return {
    file: path.join(dir, image.file),
    mime: IMAGE_MIME_BY_EXTENSION[extension],
  }
}

export const getArticleImage = async (slug: string) => {
  const article = await readArticle(slug)
  return resolveImage(articleDir(slug), article?.record.image)
}

// --- Propostas ---------------------------------------------------------

export const readProposal = (id: string) =>
  readJson<Proposal>(path.join(proposalDir(id), PROPOSAL_FILE))

export const listProposals = async (): Promise<Proposal[]> => {
  const names = await listDirectories(PROPOSALS_DIR)
  const ids = names.filter((id) => UUID_PATTERN.test(id))
  const proposals = await Promise.all(ids.map((id) => readProposal(id)))
  return proposals
    .filter((proposal) => proposal !== null)
    .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export const getProposalImage = async (id: string) => {
  const proposal = await readProposal(id)
  return resolveImage(proposalDir(id), proposal?.image)
}

const saveImage = async (dir: string, file: File): Promise<StoredImage> => {
  const extension = (IMAGE_TYPES as Record<string, ImageExtension | undefined>)[
    file.type
  ]
  if (!extension) {
    throw new StoreError('A foto precisa ser WebP, PNG ou JPEG.')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new StoreError('A foto passa do limite de 5 MB.')
  }
  const buffer = new Uint8Array(await file.arrayBuffer())
  let size: { width: number; height: number }
  try {
    const { width, height } = imageSize(buffer)
    size = { width, height }
  } catch {
    throw new StoreError('Não foi possível ler a foto enviada.')
  }
  const name = `${IMAGE_BASENAME}.${extension}`
  await writeFile(path.join(dir, name), buffer)
  return { file: name, ...size }
}

interface NewProposal {
  submission: {
    kind: 'create' | 'edit'
    slug: string
    draft: ArticleDraft
    removeImage?: boolean
  }
  author: { id: string; name: string }
  image?: File
}

export const createProposal = async ({
  submission,
  author,
  image,
}: NewProposal): Promise<Proposal> => {
  const { kind, slug, draft, removeImage } = submission
  const existing = await readArticle(slug)
  if (kind === 'create' && existing) {
    throw new StoreError('Já existe um artigo com esse endereço.', 409)
  }
  if (kind === 'edit' && !existing) {
    throw new StoreError('Esse artigo não existe.', 404)
  }

  const id = randomUUID()
  const dir = proposalDir(id)
  await mkdir(dir, { recursive: true })
  const proposal: Proposal = {
    id,
    kind,
    slug,
    authorId: author.id,
    authorName: author.name,
    createdAt: new Date().toISOString(),
    status: 'pending',
    baseUpdatedAt: existing?.record.updatedAt,
    draft,
    image: image ? await saveImage(dir, image) : undefined,
    removeImage: removeImage || undefined,
  }
  await writeJson(path.join(dir, PROPOSAL_FILE), proposal)
  return proposal
}

const removeArticleImages = async (dir: string) => {
  const files = await readdir(dir).catch(() => [])
  await Promise.all(
    files
      .filter((file) => IMAGE_FILE_PATTERN.test(file))
      .map((file) => rm(path.join(dir, file)))
  )
}

// Publica o conteúdo da proposta em content/articles/<slug>.
const publish = async (proposal: Proposal) => {
  const { slug, kind, draft } = proposal
  const existing = await readArticle(slug)
  if (kind === 'create' && existing) {
    throw new StoreError('Já existe um artigo com esse endereço.', 409)
  }
  if (kind === 'edit' && !existing) {
    throw new StoreError('Esse artigo não existe mais.', 404)
  }

  const dir = articleDir(slug)
  await mkdir(dir, { recursive: true })

  let image = existing?.record.image
  if (proposal.removeImage) {
    await removeArticleImages(dir)
    image = undefined
  }
  if (proposal.image) {
    await removeArticleImages(dir)
    await copyFile(
      path.join(proposalDir(proposal.id), proposal.image.file),
      path.join(dir, proposal.image.file)
    )
    image = { ...proposal.image, alt: draft.imageAlt || draft.title }
  } else if (image) {
    image = { ...image, alt: draft.imageAlt || draft.title }
  }

  const record: ArticleRecord = {
    title: draft.title,
    category: draft.category,
    infobox: draft.infobox,
    image,
    updatedAt: new Date().toISOString(),
  }
  await writeFile(path.join(dir, BODY_FILE), `${draft.body.trim()}\n`)
  await writeJson(path.join(dir, RECORD_FILE), record)
}

export const reviewProposal = async (
  id: string,
  decision: { action: 'approve' | 'reject'; note?: string },
  reviewer: { name: string }
): Promise<Proposal> => {
  const proposal = await readProposal(id)
  if (!proposal) {
    throw new StoreError('Proposta não encontrada.', 404)
  }
  if (proposal.status !== 'pending') {
    throw new StoreError('Essa proposta já foi analisada.', 409)
  }

  if (decision.action === 'approve') {
    await publish(proposal)
  }

  const reviewed: Proposal = {
    ...proposal,
    status: decision.action === 'approve' ? 'approved' : 'rejected',
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewer.name,
    note: decision.note || undefined,
  }
  await writeJson(path.join(proposalDir(id), PROPOSAL_FILE), reviewed)
  return reviewed
}

// Lista todos os arquivos de content/articles e content/proposals (caminho
// relativo a content/) para o backup.
export const listBackupFiles = async (): Promise<string[]> => {
  const walk = async (dir: string): Promise<string[]> => {
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
    const nested = await Promise.all(
      entries.map((entry) => {
        const full = path.join(dir, entry.name)
        return entry.isDirectory()
          ? walk(full)
          : [path.relative(CONTENT_DIR, full).split(path.sep).join('/')]
      })
    )
    return nested.flat()
  }
  const [articles, proposals] = await Promise.all([
    walk(ARTICLES_DIR),
    walk(PROPOSALS_DIR),
  ])
  return [...articles, ...proposals]
}
