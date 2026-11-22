'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'

type Mode = 'sign-in' | 'sign-up'

const FALLBACK_ERROR = 'Não foi possível entrar. Confira os dados.'

export const SignInForm = () => {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('sign-in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const isSignUp = mode === 'sign-up'

  const handleSubmit = async () => {
    setBusy(true)
    setError(null)
    const { error: authError } = isSignUp
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password })
    setBusy(false)
    if (authError) {
      setError(authError.message ?? FALLBACK_ERROR)
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <form
      className="flex max-w-sm flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        handleSubmit()
      }}
    >
      {isSignUp && (
        <Input
          aria-label="Nome"
          placeholder="Nome"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      )}
      <Input
        type="email"
        aria-label="E-mail"
        placeholder="E-mail"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <Input
        type="password"
        aria-label="Senha"
        placeholder="Senha (mínimo 8 caracteres)"
        autoComplete={isSignUp ? 'new-password' : 'current-password'}
        minLength={8}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy}>
        {isSignUp ? 'Criar conta' : 'Entrar'}
      </Button>
      <button
        type="button"
        className="text-muted-foreground cursor-default text-left text-sm hover:underline"
        onClick={() => setMode(isSignUp ? 'sign-in' : 'sign-up')}
      >
        {isSignUp ? 'Já tenho conta' : 'Ainda não tenho conta'}
      </button>
    </form>
  )
}
