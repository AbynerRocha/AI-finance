import z from 'zod'
import { transactionSchema } from '../transactions';

export const walletSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    userId: z.string(),
    category: z.string(),
    currency: z.string(),
    createdAt: z.coerce.date(),
    amountCents: z.coerce.bigint(),
    lastTransaction: transactionSchema
})

export const getAllUserWalletsSchema = z.object({
    balance: z.coerce.bigint(),
    wallets: z.nullable(z.array(walletSchema))
})

export type WalletData = z.infer<typeof walletSchema>