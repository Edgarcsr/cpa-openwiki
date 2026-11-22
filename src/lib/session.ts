import 'server-only'
import { headers } from 'next/headers'
import { connection } from 'next/server'

import { auth } from '@/lib/auth'
import { canModerate } from '@/lib/roles'

export const getSession = (requestHeaders: Headers) =>
  auth.api.getSession({ headers: requestHeaders })

export type AppSession = NonNullable<Awaited<ReturnType<typeof getSession>>>

// Sessão do pedido atual, para Server Components. O `connection()` adia a
// leitura para a hora da requisição: o Better Auth usa `new Date()`, que o
// Next não permite durante o pré-render (Cache Components).
export const getRequestSession = async () => {
  await connection()
  return getSession(await headers())
}

export const isAdmin = (session: AppSession | null) =>
  canModerate(session?.user.role)
