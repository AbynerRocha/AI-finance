import { z } from "zod";

export const transactionSchema = z.object({
    id: z.string(),
    type: z.string(),
    date: z.date(),
    walletId: z.string(),
    description: z.optional(z.string()),
    amountCents: z.bigint(),
    isPaid: z.boolean(),
    parcel: z.optional(z.number()),
    numberOfParcels: z.optional(z.number()),
    category: z.optional(z.string())
})


export type Transaction = z.infer<typeof transactionSchema>