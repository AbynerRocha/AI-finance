import type { NextFunction, Response } from "express";
import type { GetWalletRequest } from "../wallet.routes.js";
import { Wallet } from "../../controllers/wallet/index.js";
import { registerRoute } from "../../docs/helper.js";
import { getWalletSchema, walletSchema } from "../../schemas/wallet.schemas.js";
import { defaultErrorSchema } from "../../schemas/errors.schemas.js";

registerRoute({
    tags: ['🐖 wallet'],
    method: "get",
    path: "/wallet/{walletId}",
    description: "Get wallet's data",
    request: {
        params: getWalletSchema.shape.params,
        headers: getWalletSchema.shape.headers
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: walletSchema
                }
            },
            description: "Wallet was found successfully"
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

export async function getWalletRoute(req: GetWalletRequest, res: Response, next: NextFunction) {
    try {
        const { walletId } = req.params

        const wallet = await new Wallet({ walletId }).getWalletData()

        return res.status(200).json(wallet)
    } catch (error) {
        next(error)
    }
}
