'use client'

import { CheckIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { Notice } from '@/components/notice'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useJson } from '@/components/use-json'
import type { ArticleDraft } from '@/lib/article-schema'
import { authClient } from '@/lib/auth-client'
import { canModerate } from '@/lib/roles'
import type { ProposalStatus } from '@/lib/store-types'

interface ProposalDetail {
  proposal: {
    id: string
    kind: 'create' | 'edit'
    slug: string
    authorName: string
    status: ProposalStatus
    reviewedBy?: string
    note?: string
    draft: ArticleDraft
    image?: { file: string }
  }
  current: { title: string; body: string } | null
  stale: boolean
}

const STATUS_LABEL: Record<ProposalStatus, string> = {
  pending: 'pendente',
  approved: 'aceita',
  rejected: 'rejeitada',
}

const Version = ({
  heading,
  title,
  body,
}: {
  heading: string
  title: string
  body: string
}) => (
  <section className="min-w-0 rounded-md border p-4">
    <p className="text-muted-foreground mb-2 text-xs">{heading}</p>
    <h2 className="mb-2 font-medium">{title}</h2>
    <pre className="font-sans text-sm whitespace-pre-wrap">{body}</pre>
  </section>
)

const ReviewActions = ({ id, onDone }: { id: string; onDone: () => void }) => {
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const review = async (action: 'approve' | 'reject') => {
    setBusy(true)
    setError(null)
    try {
      const response = await fetch(`/api/proposals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, note: note || undefined }),
      })
      if (response.ok) {
        onDone()
        return
      }
      const result = (await response.json()) as { error?: string }
      setError(result.error ?? 'Não foi possível concluir.')
    } catch {
      setError('Sem conexão com o servidor.')
    }
    setBusy(false)
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      <input
        aria-label="Observação (opcional)"
        placeholder="Observação para o autor (opcional)"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        className="border-input h-8 rounded-lg border bg-transparent px-2.5 text-sm outline-none"
      />
      <div className="flex items-center gap-2">
        <Button disabled={busy} onClick={() => review('approve')}>
          <CheckIcon />
          Aceitar
        </Button>
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => review('reject')}
        >
          <XIcon />
          Rejeitar
        </Button>
        {error && (
          <span role="alert" className="text-destructive text-xs">
            {error}
          </span>
        )}
      </div>
    </div>
  )
}

const ProposalBody = ({
  detail,
  moderator,
  reload,
}: {
  detail: ProposalDetail
  moderator: boolean
  reload: () => void
}) => {
  const { proposal, current, stale } = detail
  const { draft } = proposal
  const pending = proposal.status === 'pending'

  return (
    <>
      <p className="text-muted-foreground text-sm">
        {proposal.kind === 'create' ? 'Página nova' : 'Edição'} de{' '}
        {proposal.authorName} · {STATUS_LABEL[proposal.status]}
        {proposal.reviewedBy && ` por ${proposal.reviewedBy}`}
        {proposal.note && ` — ${proposal.note}`}
      </p>
      {stale && pending && (
        <p className="mt-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-sm">
          O artigo mudou depois desta proposta. Aceitar substitui o texto atual.
        </p>
      )}
      <Separator className="my-3" />

      {proposal.image && (
        <Image
          src={`/api/proposals/${proposal.id}/image`}
          alt="Foto proposta"
          width={224}
          height={224}
          unoptimized
          className="mb-3 h-auto w-56 rounded-md border"
        />
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {current && (
          <Version heading="Atual" title={current.title} body={current.body} />
        )}
        <Version heading="Proposta" title={draft.title} body={draft.body} />
      </div>
      {draft.infobox.length > 0 && (
        <dl className="mt-3 grid max-w-md grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
          {draft.infobox.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted-foreground">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {pending && moderator && (
        <ReviewActions id={proposal.id} onDone={reload} />
      )}
      {proposal.status === 'approved' && (
        <Link
          href={`/article/${proposal.slug}`}
          className="mt-4 inline-block text-sm underline"
        >
          Ver artigo publicado
        </Link>
      )}
    </>
  )
}

export const ProposalReview = ({ id }: { id: string }) => {
  const { data: session, isPending } = authClient.useSession()
  const { state, reload } = useJson<ProposalDetail>(`/api/proposals/${id}`)

  if (isPending) {
    return null
  }
  if (!session) {
    return (
      <Notice
        text="Entre para ver esta proposta."
        href="/sign-in"
        action="Entrar"
      />
    )
  }
  if (state.type === 'error') {
    return (
      <p role="alert" className="text-destructive text-sm">
        {state.message}
      </p>
    )
  }
  if (state.type === 'loading') {
    return null
  }
  return (
    <ProposalBody
      detail={state.data}
      moderator={canModerate(session.user.role)}
      reload={reload}
    />
  )
}
