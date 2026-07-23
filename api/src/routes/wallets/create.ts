import type { NextFunction, Response } from "express";
import type { CreateWalletRequest } from "../wallet.routes.js";
import { Wallet } from "../../controllers/wallet/index.js";
import { AuthError } from "../../utils/error.js";
import { createWalletSchema } from "../../schemas/wallet.schemas.js";
import { defaultErrorSchema } from "../../schemas/errors.schemas.js";
import { registerRoute } from "../../docs/helper.js";

registerRoute({
    tags: ['🐖 wallet'],
    method: "post",
    path: "/wallet",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: createWalletSchema.shape.body
                }
            }
        },
        headers: createWalletSchema.shape.headers
    },
    responses: {
        200: {
            description: "Wallet created successfully"
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

export async function createWalletRoute(req: CreateWalletRequest, res: Response, next: NextFunction) {
    try {
        const { name } = req.body

        if (!req.user?.userId) {
            throw AuthError.notAuthorized()
        }

        await Wallet.createWallet({ name, userId: req.user.userId })

        return res.status(201).json()
    } catch(error) {
        next(error)
    }
}
