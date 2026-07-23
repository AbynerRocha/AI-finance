import z from 'zod'
import { AuthError } from '../utils/error.js';

export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    password: z.string(),
    createdAt: z.nullable(z.coerce.date()),
    accessLevel: z.string()
})

export const createUserSchema = z.object({
    body: z.object({
        name: z.string("O nome é obrigatório."),
        email: z.email("Insira um email válido."),
        password: z.string("A senha é obrigatória.").min(6, "A senha tem que conter no minímo 6 caractéres.")
    }),
    headers: z.looseObject({
        authorization: z.string("Não autorizado para esta ação.").startsWith("Bearer ", AuthError.notAuthorized().message)
        .openapi({
            example: "Bearer token",
            description: "Access token"
        })
    })
})

export const getUserSchema = z.object({
    params: z.object({
        id: z.string()
    }),
    headers: z.looseObject({
        authorization: z.string("Não autorizado para esta ação.").startsWith("Bearer ", AuthError.notAuthorized().message)
        .openapi({
            example: "Bearer token",
            description: "Access token"
        })
    })
})

export type UserData = z.infer<typeof userSchema>
export type CreateUserSchemaType = z.infer<typeof createUserSchema>
export type GetUserSchemaType = z.infer<typeof getUserSchema>
