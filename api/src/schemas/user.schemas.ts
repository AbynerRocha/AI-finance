import z from 'zod'

export const createUserSchema = z.object({
    body: z.object({
        name: z.string({ error: "O nome é obrigatório." }),
        email: z.email({ error: "Insira um email válido." }),
        password: z.string({ error: "A senha é obrigatória." }).min(6, "A senha tem que conter no minímo 6 caractéres.")
    }),
    headers: z.looseObject({
        authorization: z.string({ error: "Não autorizado para esta ação."}).startsWith("Bearer ", "Token inválido.")
    })
})

export type CreateUserSchemaType = z.infer<typeof createUserSchema>

//====================================================

export const getUserSchema = z.object({
    params: z.object({
        id: z.string()
    }),
    headers: z.looseObject({
        authorization: z.string({ error: "Não autorizado para esta ação."}).startsWith("Bearer ", "Token inválido.")
    })
})

export type GetUserSchemaType = z.infer<typeof getUserSchema>
