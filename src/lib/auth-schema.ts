import { z } from 'zod'

const MIN_PASSWORD_LENGTH = 8
const MAX_NAME_LENGTH = 100

const emailField = z
  .string()
  .trim()
  .min(1, 'Informe seu e-mail.')
  .pipe(z.email('E-mail inválido.'))

// Os dois formulários (entrar e criar conta) compartilham o mesmo formato de
// valores; no login o campo `name` existe mas não é usado.
export const signInSchema = z.object({
  name: z.string(),
  email: emailField,
  password: z.string().min(1, 'Informe sua senha.'),
})

// Mesmas regras do servidor (Better Auth: senha de no mínimo 8 caracteres).
export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Informe seu nome.')
    .max(MAX_NAME_LENGTH, 'Nome muito longo.'),
  email: emailField,
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `A senha precisa ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`
    ),
})

export type AccountInput = z.infer<typeof signUpSchema>
