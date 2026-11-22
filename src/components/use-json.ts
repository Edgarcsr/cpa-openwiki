'use client'

import { useCallback, useEffect, useState } from 'react'

type JsonState<T> =
  | { type: 'loading' }
  | { type: 'error'; message: string }
  | { type: 'ready'; data: T }

const fetchJson = async <T>(url: string): Promise<JsonState<T>> => {
  try {
    const response = await fetch(url)
    const json = (await response.json()) as T & { error?: string }
    if (response.ok) {
      return { type: 'ready', data: json }
    }
    return { type: 'error', message: json.error ?? 'Erro ao carregar.' }
  } catch {
    return { type: 'error', message: 'Sem conexão com o servidor.' }
  }
}

// GET simples que devolve JSON; `reload` refaz a busca (depois de uma ação).
export const useJson = <T>(url: string) => {
  const [state, setState] = useState<JsonState<T>>({ type: 'loading' })

  const reload = useCallback(async () => {
    setState(await fetchJson<T>(url))
  }, [url])

  useEffect(() => {
    // Busca no mount e quando a URL muda (sincroniza com o servidor).
    // oxlint-disable-next-line react/set-state-in-effect
    reload()
  }, [reload])

  return { state, reload }
}
