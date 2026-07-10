import z from 'zod'

export const createUserSchema = z.object({
    body: z.object({
        name: z.string("O nome é obrigatório."),
        email: z.email("Insira um email válido."),
        password: z.string("A senha é obrigatória.").min(6, "A senha tem que conter no minímo 6 caractéres.")
    }),
    headers: z.looseObject({
        authorization: z.string("Não autorizado para esta ação.").startsWith("Bearer ", "Token inválido.")
    })
})

export const getUserSchema = z.object({
    params: z.object({
        id: z.string()
    }),
    headers: z.looseObject({
        authorization: z.string("Não autorizado para esta ação.").startsWith("Bearer ", "Token inválido.")
    })
})

export type CreateUserSchemaType = z.infer<typeof createUserSchema>
export type GetUserSchemaType = z.infer<typeof getUserSchema>
