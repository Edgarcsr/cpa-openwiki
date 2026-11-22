'use client'

import { InboxIcon } from 'lucide-react'
import Link from 'next/link'

import { Notice } from '@/components/notice'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { useJson } from '@/components/use-json'
import { authClient } from '@/lib/auth-client'
import { canModerate } from '@/lib/roles'
import type { ProposalStatus } from '@/lib/store-types'
import { cn } from '@/lib/utils'

interface ProposalRow {
  id: string
  kind: 'create' | 'edit'
  slug: string
  title: string
  authorName: string
  createdAt: string
  status: ProposalStatus
}

const STATUS_LABEL: Record<ProposalStatus, string> = {
  pending: 'Pendente',
  approved: 'Aceita',
  rejected: 'Rejeitada',
}

const KIND_LABEL = { create: 'Página nova', edit: 'Edição' } as const

const ProposalsTable = ({ rows }: { rows: ProposalRow[] }) => {
  if (rows.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>Nenhuma proposta</EmptyTitle>
          <EmptyDescription>
            Páginas novas e edições enviadas para análise aparecem aqui.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }
  return (
    <ul className="divide-y rounded-md border">
      {rows.map((row) => (
        <li key={row.id}>
          <Link
            href={`/proposals/${row.id}`}
            className="hover:bg-muted/50 flex cursor-default items-center justify-between gap-4 px-4 py-3 text-sm"
          >
            <span className="min-w-0">
              <span className="block truncate font-medium">{row.title}</span>
              <span className="text-muted-foreground text-xs">
                {KIND_LABEL[row.kind]} · {row.authorName} ·{' '}
                {new Date(row.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </span>
            <span
              className={cn(
                'shrink-0 rounded-full border px-2 py-0.5 text-xs',
                row.status === 'pending' && 'bg-muted'
              )}
            >
              {STATUS_LABEL[row.status]}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export const ProposalsList = () => {
  const { data: session, isPending } = authClient.useSession()
  const { state } = useJson<ProposalRow[]>('/api/proposals')

  if (isPending) {
    return null
  }
  if (!session) {
    return (
      <Notice
        text="Entre para ver suas propostas."
        href="/sign-in"
        action="Entrar"
      />
    )
  }

  const moderator = canModerate(session.user.role)

  return (
    <>
      <p className="text-muted-foreground mb-4 text-sm">
        {moderator
          ? 'Propostas de todas as pessoas, mais recentes primeiro.'
          : 'Suas propostas, mais recentes primeiro.'}
      </p>
      {state.type === 'loading' && null}
      {state.type === 'error' && (
        <p role="alert" className="text-destructive text-sm">
          {state.message}
        </p>
      )}
      {state.type === 'ready' && <ProposalsTable rows={state.data} />}
    </>
  )
}
