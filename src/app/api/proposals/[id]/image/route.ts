import { forbidden, unauthorized } from '@/lib/api'
import { imageResponse } from '@/lib/image-response'
import { getSession, isAdmin } from '@/lib/session'
import { getProposalImage, readProposal } from '@/lib/store'

// Foto de uma proposta pendente: só o autor e admins enxergam.
export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const session = await getSession(request.headers)
  if (!session) {
    return unauthorized()
  }
  const { id } = await params
  const proposal = await readProposal(id)
  if (!proposal) {
    return new Response('Not found', { status: 404 })
  }
  if (!isAdmin(session) && proposal.authorId !== session.user.id) {
    return forbidden()
  }
  const image = await getProposalImage(id)
  return imageResponse(image, 'private, no-store')
}
