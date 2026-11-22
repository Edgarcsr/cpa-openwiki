import { revalidateTag } from 'next/cache'

import { jsonError, toErrorResponse, unauthorized } from '@/lib/api'
import { ARTICLES_TAG } from '@/lib/article'
import { submissionSchema } from '@/lib/article-schema'
import { getSession, isAdmin } from '@/lib/session'
import { createProposal, listProposals, reviewProposal } from '@/lib/store'

// Lista as propostas: o admin vê todas, os demais só as próprias.
export const GET = async (request: Request) => {
  const session = await getSession(request.headers)
  if (!session) {
    return unauthorized()
  }
  const proposals = await listProposals()
  const visible = isAdmin(session)
    ? proposals
    : proposals.filter((proposal) => proposal.authorId === session.user.id)
  return Response.json(
    visible.map(({ draft, ...proposal }) => ({
      ...proposal,
      title: draft.title,
    }))
  )
}

// Recebe multipart: `data` (JSON) e, opcionalmente, `image`. Proposta de
// admin é publicada na hora; as demais ficam pendentes até um admin aceitar.
export const POST = async (request: Request) => {
  const session = await getSession(request.headers)
  if (!session) {
    return unauthorized()
  }

  const form = await request.formData().catch(() => null)
  const rawData = form?.get('data')
  if (typeof rawData !== 'string') {
    return jsonError('Envio inválido.', 400)
  }

  let json: unknown
  try {
    json = JSON.parse(rawData)
  } catch {
    return jsonError('Envio inválido.', 400)
  }
  const parsed = submissionSchema.safeParse(json)
  if (!parsed.success) {
    return jsonError('Confira os campos: título e texto são obrigatórios.', 400)
  }

  const image = form?.get('image')
  try {
    const proposal = await createProposal({
      submission: parsed.data,
      author: { id: session.user.id, name: session.user.name },
      image: image instanceof File && image.size > 0 ? image : undefined,
    })

    if (!isAdmin(session)) {
      return Response.json({ proposal, published: false }, { status: 201 })
    }

    const published = await reviewProposal(
      proposal.id,
      { action: 'approve' },
      session.user
    )
    revalidateTag(ARTICLES_TAG, { expire: 0 })
    return Response.json(
      { proposal: published, published: true },
      { status: 201 }
    )
  } catch (error) {
    return toErrorResponse(error)
  }
}
