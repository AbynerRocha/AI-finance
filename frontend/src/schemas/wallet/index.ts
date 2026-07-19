import z from 'zod'
import { transactionSchema } from '../transactions';

export const walletSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    userId: z.string(),
    currency: z.string(),
    amountCents: z.coerce.bigint(),
    createdAt: z.coerce.date(),
    transactions: z.optional(z.array(transactionSchema))
})

export const getAllUserWalletsSchema = z.array(walletSchema)

export type WalletData = z.infer<typeof walletSchema>