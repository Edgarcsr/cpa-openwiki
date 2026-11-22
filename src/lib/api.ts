import 'server-only'
import { StoreError } from '@/lib/store'

export const jsonError = (message: string, status: number) =>
  Response.json({ error: message }, { status })

// Converte erros esperados do armazenamento em respostas HTTP.
export const toErrorResponse = (error: unknown) => {
  if (error instanceof StoreError) {
    return jsonError(error.message, error.status)
  }
  throw error
}

export const unauthorized = () => jsonError('Entre para continuar.', 401)
export const forbidden = () => jsonError('Você não tem permissão.', 403)
