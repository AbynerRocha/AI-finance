import z from 'zod'

export const walletSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    userId: z.string(),
    currency: z.string(),
    amountCent: z.coerce.bigint(),
    createdAt: z.coerce.date()
})

export const getAllUserWalletsSchema = z.array(walletSchema)

export type WalletData = z.infer<typeof walletSchema>