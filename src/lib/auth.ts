import 'server-only'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

import { betterAuth } from 'better-auth'
import type { BetterAuthOptions } from 'better-auth'
import { APIError } from 'better-auth/api'
import { nextCookies } from 'better-auth/next-js'

// Banco de autenticação (usuários e sessões). Fica fora de content/ de
// propósito: o backup exporta o conteúdo, nunca senhas.
const DATA_DIR = path.join(process.cwd(), 'data')
mkdirSync(DATA_DIR, { recursive: true })

const database = new DatabaseSync(path.join(DATA_DIR, 'openwiki.db'))

const countUsers = (): number => {
  try {
    const row = database.prepare('SELECT COUNT(*) AS total FROM user').get() as
      | { total: number }
      | undefined
    return row?.total ?? 0
  } catch {
    // Tabelas ainda não criadas (migração em andamento).
    return 0
  }
}

// Sem nenhum usuário, o site leva ao onboarding para criar o dono.
export const hasUsers = () => countUsers() > 0

// OPENWIKI_SIGNUP=closed trava novos cadastros (o primeiro usuário, que vira
// dono, sempre pode se cadastrar).
const signupClosed = process.env.OPENWIKI_SIGNUP === 'closed'

export const authOptions = {
  database,
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  user: {
    additionalFields: {
      role: { type: 'string', defaultValue: 'user', input: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: (user: Record<string, unknown>) => {
          const isFirstUser = countUsers() === 0
          if (!isFirstUser && signupClosed) {
            throw new APIError('FORBIDDEN', {
              message: 'Os cadastros estão fechados.',
            })
          }
          return Promise.resolve({
            data: { ...user, role: isFirstUser ? 'owner' : 'user' },
          })
        },
      },
    },
  },
  plugins: [nextCookies()],
} satisfies BetterAuthOptions

export const auth = betterAuth(authOptions)
