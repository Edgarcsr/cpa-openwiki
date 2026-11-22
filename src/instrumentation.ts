// Cria as tabelas do Better Auth no SQLite quando o servidor sobe.
export const register = async () => {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return
  }
  const { getMigrations } = await import('better-auth/db/migration')
  const { authOptions } = await import('@/lib/auth')
  const { runMigrations } = await getMigrations(authOptions)
  await runMigrations()
}
