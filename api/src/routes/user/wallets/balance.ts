import type { Response, NextFunction } from "express";
import type { AddBalanceRequest } from "../../wallet.routes.js";
import { Wallet } from "../../../controllers/wallet/index.js";

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
