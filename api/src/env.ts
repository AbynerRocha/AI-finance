import z from 'zod'

const envSchema = z.object({
    PORT: z.coerce.number(),
    JWT_SECRET: z.string(),
    DATABASE_URL: z.string(),
    FRONT_END_URL: z.string(),
    GEMINI_API_KEY: z.string(),
})

export const env = envSchema.parse(process.env)