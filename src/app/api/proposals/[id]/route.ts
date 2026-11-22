import { revalidateTag } from 'next/cache'

import { forbidden, jsonError, toErrorResponse, unauthorized } from '@/lib/api'
import { ARTICLES_TAG } from '@/lib/article'
import { reviewSchema } from '@/lib/article-schema'
import { getSession, isAdmin } from '@/lib/session'
import { readArticle, readProposal, reviewProposal } from '@/lib/store'

interface Context {
  params: Promise<{ id: string }>
}

// Detalhe da proposta, com o artigo atual (para comparar) e se ele mudou
// depois da proposta ter sido feita.
export const GET = async (request: Request, { params }: Context) => {
  const session = await getSession(request.headers)
  if (!session) {
    return unauthorized()
  }
  const { id } = await params
  try {
    const proposal = await readProposal(id)
    if (!proposal) {
      return jsonError('Proposta não encontrada.', 404)
    }
    if (!isAdmin(session) && proposal.authorId !== session.user.id) {
      return forbidden()
    }
    const current = await readArticle(proposal.slug)
    return Response.json({
      proposal,
      current: current && { ...current.record, body: current.body },
      stale:
        proposal.kind === 'edit' &&
        current?.record.updatedAt !== proposal.baseUpdatedAt,
    })
  } catch (error) {
    return toErrorResponse(error)
  }
}

// Aceita ou rejeita (só admin).
export const PATCH = async (request: Request, { params }: Context) => {
  const session = await getSession(request.headers)
  if (!session) {
    return unauthorized()
  }
  if (!isAdmin(session)) {
    return forbidden()
  }
  const parsed = reviewSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return jsonError('Envio inválido.', 400)
  }
  const { id } = await params
  try {
    const proposal = await reviewProposal(id, parsed.data, session.user)
    revalidateTag(ARTICLES_TAG, { expire: 0 })
    return Response.json({ proposal })
  } catch (error) {
    return toErrorResponse(error)
  }
}
