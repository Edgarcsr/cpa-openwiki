import { z } from 'zod'

const MIN_PASSWORD_LENGTH = 8
const MAX_NAME_LENGTH = 100

// Mesmas regras do servidor (Better Auth: senha de no mínimo 8 caracteres).
export const adminSetupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Informe seu nome.')
    .max(MAX_NAME_LENGTH, 'Nome muito longo.'),
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail.')
    .pipe(z.email('E-mail inválido.')),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `A senha precisa ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`
    ),
})

export type AdminSetupInput = z.infer<typeof adminSetupSchema>
