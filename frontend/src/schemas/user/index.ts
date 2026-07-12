import z from 'zod'

export const userSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.email(),
    createdAt: z.date()
})

export const registerSchema = z.object({
  name: z.string("Insira um nome."),
  email: z.email("Insira um email válido."),
  password: z.string().min(6, "A senha tem que conter no minímo 6 caracteres.").max(30, "A senha só pode conter no máximo 30 caracteres.")
})

export const loginSchema = z.object({
  email: z.email("Insira um email válido."),
  password: z.string().min(6, "A senha tem que conter no minímo 6 caracteres.").max(30, "A senha só pode conter no máximo 30 caracteres.")
})

export type UserData = z.infer<typeof userSchema>
export type LoginSchemaType = z.infer<typeof loginSchema>
export type RegisterSchemaType = z.infer<typeof registerSchema>