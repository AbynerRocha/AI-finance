import type { Response, NextFunction } from "express";
import type { AddBalanceRequest } from "../wallet.routes.js";
import { Wallet } from "../../controllers/wallet/index.js";
import { balanceSchema } from "../../schemas/wallet.schemas.js";
import { defaultErrorSchema } from "../../schemas/errors.schemas.js";
import { registerRoute } from "../../docs/helper.js";

registerRoute({
    tags: ['🐖 wallet'],
    method: "patch",
    path: "/wallet/{walletid}/balance",
    description: "Update wallet balance",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: balanceSchema.shape.body
                }
            }
        },
        params: balanceSchema.shape.params,
        headers: balanceSchema.shape.headers
    },
    responses: {
        200: {
            description: "Balance added to wallet successfully"
        },
        404: {
            content: {
                "application/json": {
                    schema: defaultErrorSchema
                }
            },
            description: "Wallet not found"
        }
    }
})


export async function changeBalanceRoute(req: AddBalanceRequest, res: Response, next: NextFunction) {
    try {
        const walletId = req.params.walletId
        const amount = req.body.amount

        const wallet = new Wallet({ walletId })

        await wallet.changeBalance(amount)

        return res.status(200).json()
    } catch (error) {
        next(error)
    }
}
