import type { NextFunction, Response } from "express";
import type { getAllWalletsRequest } from "../wallet.routes.js";
import { AuthError } from "../../utils/error.js";
import { getAllUserWallets, getUserBalance } from "../../controllers/user/index.js";
import { registerRoute } from "../../docs/helper.js";
import { getAllWalletsSchema, walletSchema } from "../../schemas/wallet.schemas.js";
import { defaultErrorSchema } from "../../schemas/errors.schemas.js";
import { z } from "zod";

registerRoute({
    tags: ['🐖 wallet'],
    method: "get",
    path: "/wallet",
    description: "Get all user's wallets",
    request: {
        headers: getAllWalletsSchema.shape.headers
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.object({
                        wallets: z.array(walletSchema),
                        balance: z.string()
                    })
                }
            },
            description: "User's wallets was found successfully"
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
export async function getAllWalletsRoute(req: getAllWalletsRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user.userId) {
            throw AuthError.notAuthorized()
        }

        const wallets = await getAllUserWallets(req.user.userId)
        const userBalance = await getUserBalance(req.user.userId)

        return res.status(200).json({ 
            wallets,
            balance: userBalance.toString()
        })
    } catch (error) {
        next(error)
    }
}
