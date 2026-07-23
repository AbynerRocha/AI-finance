import z, { type TypeOf } from "zod";
import { AuthError, WalletError } from "../utils/error.js";
import { transactionSchema } from "./transaction.schemas.js";

export const walletSchema = z.object({
    id: z.string(),
    name: z.string(),
    userId: z.string(),
    type: z.string(),
    category: z.optional(z.string()),
    currency: z.string(),
    amountCents: z.bigint(),
    createdAt: z.date(),
    lastTransaction: z.optional(transactionSchema)
})

export const createWalletSchema = z.object({
    body: z.object({
        name: z.string()  
    }),
    headers: z.looseObject({
        authorization: z.string().startsWith("Bearer ", AuthError.notAuthorized().message)
        .openapi({
            example: "Bearer token",
            description: "Access token"
        })
    })
})

export const getWalletSchema = z.object({
    params: z.object({
        walletId: z.uuid()
    }),
    headers: z.looseObject({
        authorization: z.string().startsWith("Bearer ", AuthError.notAuthorized().message)
        .openapi({
            example: "Bearer token",
            description: "Access token"
        })
    })
})

export const getAllWalletsSchema = z.object({
    headers: z.looseObject({
        authorization: z.string().startsWith("Bearer ", AuthError.notAuthorized().message)
        .openapi({
            example: "Bearer token",
            description: "Access token"
        })
    })
})

export const balanceSchema = z.object({
    params: z.object({
        walletId: z.string()
    }),
    body: z.object({
        amount: z.coerce.bigint().min(1n, WalletError.invalidAmount().message)
    }),
    headers: z.looseObject({
        authorization: z.string().startsWith("Bearer ", AuthError.notAuthorized().message)
        .openapi({
            example: "Bearer token",
            description: "Access token"
        })
    })
})

export type WalletData = z.infer<typeof walletSchema>
export type BalanceSchema = z.infer<typeof balanceSchema>
export type GetWalletSchema = z.infer<typeof getWalletSchema>
export type CreateWalletSchema = z.infer<typeof createWalletSchema>
export type getAllWalletsSchema = z.infer<typeof getAllWalletsSchema>