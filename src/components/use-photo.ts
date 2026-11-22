'use client'

import { useState } from 'react'

import { MAX_IMAGE_BYTES } from '@/lib/article-schema'

const BYTES_PER_MB = 1024 * 1024

// Foto do infobox: a que já existe no artigo ou uma nova escolhida agora.
export const usePhoto = (existingSrc: string | undefined) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [keepExisting, setKeepExisting] = useState(Boolean(existingSrc))
  const [error, setError] = useState<string | null>(null)

  const clearPreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
  }

  const pick = (next: File | undefined) => {
    if (!next) {
      return
    }
    if (next.size > MAX_IMAGE_BYTES) {
      setError(
        `A foto passa do limite de ${MAX_IMAGE_BYTES / BYTES_PER_MB} MB.`
      )
      return
    }
    clearPreview()
    setError(null)
    setFile(next)
    setPreview(URL.createObjectURL(next))
  }

  const remove = () => {
    clearPreview()
    setFile(null)
    setPreview(null)
    setKeepExisting(false)
  }

  const shownSrc = preview ?? (keepExisting ? (existingSrc ?? null) : null)
  const removeExisting = Boolean(existingSrc) && !keepExisting && !file

  return { file, shownSrc, removeExisting, error, pick, remove }
}
