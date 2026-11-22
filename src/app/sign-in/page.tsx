import type { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { Suspense } from 'react'

import { SignInForm } from '@/components/sign-in-form'
import { hasUsers } from '@/lib/auth'
import { getRequestSession } from '@/lib/session'

export const metadata: Metadata = { title: 'Entrar' }

// Wiki recém-instalada: primeiro cria-se o administrador, no onboarding. Quem
// já está logado não precisa desta tela.
const SessionGuard = async () => {
  await connection()
  if (!hasUsers()) {
    redirect('/onboarding')
  }
  if (await getRequestSession()) {
    redirect('/')
  }
  return null
}

const SignInPage = () => (
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
      <SignInForm />
    </div>
    <Suspense fallback={null}>
      <SessionGuard />
    </Suspense>
  </main>
)

export default SignInPage
