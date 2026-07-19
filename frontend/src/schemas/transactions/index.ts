import { z } from "zod";

export const transactionSchema = z.object({
    id: z.string(),
    type: z.string(),
    date: z.coerce.date(),
    walletId: z.string(),
    category: z.string(),
    description: z.optional(z.string()),
    amountCents: z.coerce.bigint(),
    isPaid: z.boolean(),
    parcel: z.optional(z.number()),
    numberOfParcels: z.optional(z.number())
})

export type TransactionData = z.infer<typeof transactionSchema>