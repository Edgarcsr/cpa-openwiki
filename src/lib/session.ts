import 'server-only'
import { auth } from '@/lib/auth'
import { canModerate } from '@/lib/roles'

export const getSession = (headers: Headers) => auth.api.getSession({ headers })

export type AppSession = NonNullable<Awaited<ReturnType<typeof getSession>>>

export const isAdmin = (session: AppSession | null) =>
  canModerate(session?.user.role)
