import type { NextFunction, Response } from "express";
import type { CreateWalletRequest } from "../../wallet.routes.js";
import { Wallet } from "../../../controllers/wallet/index.js";
import { getDataFromToken } from "../../../controllers/auth/token/index.js";
import { AuthError } from "../../../utils/error.js";

export async function createWalletRoute(req: CreateWalletRequest, res: Response, next: NextFunction) {
    const { userId } = req.body

    try {
        if(req.user.userId !== userId) {
            throw AuthError.notAuthorized()
        }

        const wallet = await Wallet.createWallet({ userId })

        return res.status(201).send(wallet.walletId)
    } catch(error) {
        next(error)        
    }
}
