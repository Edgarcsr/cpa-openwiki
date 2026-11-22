'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  EyeIcon,
  EyeOffIcon,
  InboxIcon,
  KeyRoundIcon,
  UserIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { authClient } from '@/lib/auth-client'
import { signInSchema, signUpSchema } from '@/lib/auth-schema'
import type { AccountInput } from '@/lib/auth-schema'

export type AccountMode = 'sign-in' | 'sign-up'

const FALLBACK_ERROR = 'Não foi possível continuar. Confira os dados.'
const FORBIDDEN_STATUS = 403

// O Better Auth responde em inglês; traduzimos os erros conhecidos.
const ERROR_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: 'E-mail ou senha incorretos.',
  INVALID_PASSWORD: 'E-mail ou senha incorretos.',
  INVALID_EMAIL: 'E-mail inválido.',
  USER_ALREADY_EXISTS: 'Já existe uma conta com esse e-mail.',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Já existe uma conta com esse e-mail.',
  PASSWORD_TOO_SHORT: 'A senha precisa ter no mínimo 8 caracteres.',
  PASSWORD_TOO_LONG: 'A senha é muito longa.',
}

const errorMessage = (error: { code?: string; status?: number }) => {
  if (error.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code]
  }
  if (error.status === FORBIDDEN_STATUS) {
    return 'Os cadastros estão fechados.'
  }
  return FALLBACK_ERROR
}

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p role="alert" className="text-destructive text-xs">
      {message}
    </p>
  ) : null

// Formulário de conta (entrar ou criar), usado no login e no onboarding do
// administrador. A validação é feita aqui com zod (por isso o `noValidate`);
// o servidor confere de novo. Troque `key` ao mudar de modo para recriar.
export const AccountForm = ({
  mode,
  submitLabel,
}: {
  mode: AccountMode
  submitLabel: string
}) => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const isSignUp = mode === 'sign-up'
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AccountInput>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  // Olho aberto = clique para mostrar; olho riscado = clique para ocultar.
  const passwordLabel = showPassword ? 'Ocultar senha' : 'Mostrar senha'

  const onSubmit = async (values: AccountInput) => {
    const { error } = isSignUp
      ? await authClient.signUp.email(values)
      : await authClient.signIn.email({
          email: values.email,
          password: values.password,
        })
    if (error) {
      setError('root', { message: errorMessage(error) })
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {isSignUp && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="account-name">Nome</Label>
          <InputGroup>
            <InputGroupAddon>
              <UserIcon />
            </InputGroupAddon>
            <InputGroupInput
              id="account-name"
              placeholder="Seu nome"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              {...register('name')}
            />
          </InputGroup>
          <FieldError message={errors.name?.message} />
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="account-email">E-mail</Label>
        <InputGroup>
          <InputGroupAddon>
            <InboxIcon />
          </InputGroupAddon>
          <InputGroupInput
            id="account-email"
            type="email"
            placeholder="voce@exemplo.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </InputGroup>
        <FieldError message={errors.email?.message} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="account-password">Senha</Label>
        <InputGroup>
          <InputGroupAddon>
            <KeyRoundIcon />
          </InputGroupAddon>
          <InputGroupInput
            id="account-password"
            type={showPassword ? 'text' : 'password'}
            placeholder={isSignUp ? 'Mínimo de 8 caracteres' : 'Sua senha'}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger
                render={
                  <InputGroupButton
                    size="icon-xs"
                    aria-label={passwordLabel}
                    onClick={() => setShowPassword((current) => !current)}
                  />
                }
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </TooltipTrigger>
              <TooltipContent>{passwordLabel}</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
        <FieldError message={errors.password?.message} />
      </div>
      <FieldError message={errors.root?.message} />
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full"
      >
        {submitLabel}
      </Button>
    </form>
  )
}
