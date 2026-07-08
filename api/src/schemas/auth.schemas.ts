import z from 'zod'

export const loginSchema =  z.object({
    body: z.object({
        email: z.email("O email é obrigatório"),
        password: z.string("A senha é obrigatória.")
    })
})

export type LoginSchemaType = z.infer<typeof loginSchema>



