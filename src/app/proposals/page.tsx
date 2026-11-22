import type { Metadata } from 'next'

import { PageShell } from '@/components/page-shell'
import { ProposalsList } from '@/components/proposals-list'

export const metadata: Metadata = { title: 'Propostas' }

const ProposalsPage = () => (
  <PageShell>
    <h1 className="mb-4 text-lg">Propostas</h1>
    <ProposalsList />
  </PageShell>
)

export default ProposalsPage
