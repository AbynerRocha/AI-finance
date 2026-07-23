import type { NextFunction, Response } from "express";
import { registerRoute } from "../../docs/helper.js";
import { createTransactionSchema } from "../../schemas/transaction.schemas.js";
import type { CreateTransactionRequest } from "../wallet.routes.js";
import { createTransaction } from "../../controllers/transaction/index.js";
import { defaultErrorSchema } from "../../schemas/errors.schemas.js";
import { ZodError } from "zod";
import { WalletError } from "../../utils/error.js";

registerRoute({
    tags: ['🐖 wallet', '💵 transaction'],
    method: 'post',
    path: '/wallet/{walletId}/transaction',
    description: "Create a new transaction",
    request: {
        body: {
            content: {
                "application/json": {
                    schema:  createTransactionSchema.shape.body
                }
            }
        },
        headers: createTransactionSchema.shape.headers,
        params: createTransactionSchema.shape.params
    },
    responses: {
        201: {
            description: "Transaction created successfully"
        },
        404: {
            content: {
                "application/json": {
                    schema: defaultErrorSchema
                }
            },
            description: "Wallet not found"
        },
        409: {
            content: {
                "application/json": {
                    schema: defaultErrorSchema
                }
            },
            description: "Invalid amount"
        }
    }
})

export async function createTransactionRoute(req: CreateTransactionRequest, res: Response, next: NextFunction) {
    try {
        const { walletId } = req.params
        const { type, date, amountCents } = req.body

        await createTransaction({
            amountCents,
            type,
            date,
            walletId,
            isPaid: false
        })

        return res.status(201).send()
    } catch(error) {
        if(error instanceof ZodError) {
            if(error.issues.find((v) =>  v.path[0]?.toString().includes('amountCents'))) {
                next(WalletError.invalidAmount())
            }
        }

        next(error)
    }
}
