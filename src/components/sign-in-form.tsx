'use client'

import { useState } from 'react'

import { AccountForm } from '@/components/account-form'
import type { AccountMode } from '@/components/account-form'

const COPY = {
  'sign-in': {
    title: 'Entrar',
    text: 'Entre para propor páginas novas e edições.',
    submit: 'Entrar',
    toggle: 'Ainda não tenho conta',
  },
  'sign-up': {
    title: 'Criar conta',
    text: 'Com uma conta você pode propor páginas novas e edições.',
    submit: 'Criar conta',
    toggle: 'Já tenho conta',
  },
} as const

// Entrar ou criar conta, com o mesmo visual da criação do administrador.
export const SignInForm = () => {
  const [mode, setMode] = useState<AccountMode>('sign-in')
  const copy = COPY[mode]

  return (
    <>
      <h1 className="text-center text-lg font-medium">{copy.title}</h1>
      <p className="text-muted-foreground mt-1 mb-6 text-center text-xs leading-relaxed">
        {copy.text}
      </p>
      <AccountForm key={mode} mode={mode} submitLabel={copy.submit} />
      <button
        type="button"
        className="text-muted-foreground mt-4 block w-full cursor-default text-center text-sm hover:underline"
        onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
      >
        {copy.toggle}
      </button>
    </>
  )
}
