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
import { adminSetupSchema } from '@/lib/auth-schema'
import type { AdminSetupInput } from '@/lib/auth-schema'

const FALLBACK_ERROR = 'Não foi possível criar a conta. Confira os dados.'

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p role="alert" className="text-destructive text-xs">
      {message}
    </p>
  ) : null

// Primeira conta da wiki: o servidor a marca como `owner` (administrador).
// A validação é feita aqui com zod (por isso o `noValidate`); o servidor
// confere de novo.
export const AdminSetupForm = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AdminSetupInput>({
    resolver: zodResolver(adminSetupSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  // Olho aberto = clique para mostrar; olho riscado = clique para ocultar.
  const passwordLabel = showPassword ? 'Ocultar senha' : 'Mostrar senha'

  const onSubmit = async (values: AdminSetupInput) => {
    const { error } = await authClient.signUp.email(values)
    if (error) {
      setError('root', { message: error.message ?? FALLBACK_ERROR })
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
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="admin-name">Nome</Label>
        <InputGroup>
          <InputGroupAddon>
            <UserIcon />
          </InputGroupAddon>
          <InputGroupInput
            id="admin-name"
            placeholder="Seu nome"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            {...register('name')}
          />
        </InputGroup>
        <FieldError message={errors.name?.message} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="admin-email">E-mail</Label>
        <InputGroup>
          <InputGroupAddon>
            <InboxIcon />
          </InputGroupAddon>
          <InputGroupInput
            id="admin-email"
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
        <Label htmlFor="admin-password">Senha</Label>
        <InputGroup>
          <InputGroupAddon>
            <KeyRoundIcon />
          </InputGroupAddon>
          <InputGroupInput
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Mínimo de 8 caracteres"
            autoComplete="new-password"
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
        Criar conta de administrador
      </Button>
    </form>
  )
}
