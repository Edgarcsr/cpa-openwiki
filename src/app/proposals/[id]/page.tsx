import type { Metadata } from 'next'

import { PageShell } from '@/components/page-shell'
import { ProposalReview } from '@/components/proposal-review'

export const metadata: Metadata = { title: 'Proposta' }

// `params` é lido na requisição (o id não é conhecido no build).
export const instant = false

const ProposalPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  return (
    <PageShell>
      <h1 className="mb-1 text-lg">Proposta</h1>
      <ProposalReview id={id} />
    </PageShell>
  )
}

export default ProposalPage
