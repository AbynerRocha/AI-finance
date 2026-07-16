import z from 'zod'
import { AuthError } from '../utils/error.js';

export const loginSchema = z.object({
    body: z.object({
        email: z.email("O email é obrigatório"),
        password: z.string("A senha é obrigatória.")
    }),
})

export const registerSchema = z.object({
    body: z.object({
        name: z.string(""),
        email: z.email("O email é obrigatório"),
        password: z.string("A senha é obrigatória.")
    })
})

export const logoutSchema = z.object({
    cookies: z.object({
        finance_refresh_token: z.string()
    })
})

export const refreshSchema = z.object({
    cookies: z.object({
        finance_refresh_token: z.string()
    })
})

export type LoginSchemaType = z.infer<typeof loginSchema>
export type LogoutSchemaType = z.infer<typeof logoutSchema>
export type RefreshSchemaType = z.infer<typeof refreshSchema>
export type RegisterSchemaType = z.infer<typeof registerSchema>