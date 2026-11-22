import type { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { Suspense } from 'react'

import { AccountForm } from '@/components/account-form'
import { hasUsers } from '@/lib/auth'

export const metadata: Metadata = { title: 'Criar conta de administrador' }

// Só existe enquanto não há nenhum usuário; depois disso, volta para o login.
const SetupGuard = async () => {
  await connection()
  if (hasUsers()) {
    redirect('/sign-in')
  }
  return null
}

const AdminSetupPage = () => (
  <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
    <Image
      src="/openwiki-logo.svg"
      alt="OpenWiki"
      width={1545}
      height={222}
      priority
      className="absolute top-8 left-6 h-4 w-auto sm:left-12 lg:left-20 dark:invert"
    />
    <div className="w-full max-w-sm">
      <h1 className="text-center text-lg font-medium">
        Criar conta de administrador
      </h1>
      <p className="text-muted-foreground mt-1 mb-6 text-center text-xs leading-relaxed">
        Esta é a primeira conta da wiki e terá acesso total: publicar direto,
        aceitar propostas e exportar o backup.
      </p>
      <AccountForm mode="sign-up" submitLabel="Criar conta de administrador" />
    </div>
    <Suspense fallback={null}>
      <SetupGuard />
    </Suspense>
  </main>
)

export default AdminSetupPage
