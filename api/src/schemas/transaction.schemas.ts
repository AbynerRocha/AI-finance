import { z } from "zod";
import { AuthError } from "../utils/error.js";

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

export const createTransactionSchema = z.object({
    params: z.object({
        walletId: z.string()
    }),
    body: z.object({
        type: z.string(),
        amountCents: z.coerce.bigint(),
        date: z.coerce.date()  
    }),
    headers: z.looseObject({
        authorization: z.string("Não autorizado para esta ação.").openapi({ example: "Bearer token" }).startsWith("Bearer ", AuthError.notAuthorized().message)
    })
})

export type Transaction = z.infer<typeof transactionSchema>
export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>