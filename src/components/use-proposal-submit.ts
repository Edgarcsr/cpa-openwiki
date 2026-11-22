'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { ArticleDraft } from '@/lib/article-schema'

export type SubmitStatus =
  | { type: 'idle' }
  | { type: 'sending' }
  | { type: 'error'; message: string }
  | { type: 'sent' }

interface SubmitInput {
  kind: 'create' | 'edit'
  slug: string
  draft: ArticleDraft
  image: File | null
  removeImage: boolean
}

interface ProposalResponse {
  error?: string
  published?: boolean
}

// Envia a proposta para POST /api/proposals. Admin publica na hora (vai para
// o artigo); os demais ficam aguardando análise.
export const useProposalSubmit = () => {
  const router = useRouter()
  const [status, setStatus] = useState<SubmitStatus>({ type: 'idle' })

  const submit = async ({
    kind,
    slug,
    draft,
    image,
    removeImage,
  }: SubmitInput) => {
    setStatus({ type: 'sending' })
    const formData = new FormData()
    formData.set('data', JSON.stringify({ kind, slug, draft, removeImage }))
    if (image) {
      formData.set('image', image)
    }

    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        body: formData,
      })
      const result = (await response.json()) as ProposalResponse
      if (!response.ok) {
        setStatus({
          type: 'error',
          message: result.error ?? 'Não foi possível enviar.',
        })
        return
      }
      if (result.published) {
        router.push(`/article/${slug}`)
        router.refresh()
        return
      }
      setStatus({ type: 'sent' })
    } catch {
      setStatus({ type: 'error', message: 'Sem conexão com o servidor.' })
    }
  }

  return { status, setStatus, submit }
}
