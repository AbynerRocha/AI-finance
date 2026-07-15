import z from 'zod'

export const walletSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    userId: z.string(),
    currency: z.string(),
    amountCent: z.bigint(),
    createdAt: z.date()
})

export type WalletData = z.infer<typeof walletSchema>