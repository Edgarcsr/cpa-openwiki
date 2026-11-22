import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { Suspense } from 'react'

import { PageShell } from '@/components/page-shell'
import { SignInForm } from '@/components/sign-in-form'
import { hasUsers } from '@/lib/auth'

export const metadata: Metadata = { title: 'Entrar' }

// Wiki recém-instalada: primeiro cria-se o dono, no onboarding.
const SetupGuard = async () => {
  await connection()
  if (!hasUsers()) {
    redirect('/onboarding')
  }
  return null
}

const SignInPage = () => (
  <PageShell>
    <h1 className="text-lg">Entrar</h1>
    <p className="text-muted-foreground mt-1 mb-4 text-sm">
      Com uma conta você pode propor páginas novas e edições.
    </p>
    <SignInForm />
    <Suspense fallback={null}>
      <SetupGuard />
    </Suspense>
  </PageShell>
)

export default SignInPage
