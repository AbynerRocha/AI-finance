import type { NextFunction, Response } from "express";
import type { CreateWalletRequest } from "../../wallet.routes.js";
import { Wallet } from "../../../controllers/wallet/index.js";
import { getDataFromToken } from "../../../controllers/auth/token/index.js";
import { AuthError } from "../../../utils/error.js";

export async function createWalletRoute(req: CreateWalletRequest, res: Response, next: NextFunction) {
    try {
        const { name } = req.body

        if (!req.user?.userId) {
            throw AuthError.notAuthorized()
        }

        const wallet = await Wallet.createWallet({ name, userId: req.user.userId })

        return res.status(201).json({ walletId: wallet.walletId })
    } catch(error) {
        next(error)
    }
}
