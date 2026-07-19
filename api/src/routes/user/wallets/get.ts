import type { NextFunction, Response } from "express";
import type { GetWalletRequest } from "../../wallet.routes.js";
import { Wallet } from "../../../controllers/wallet/index.js";

export async function getWalletRoute(req: GetWalletRequest, res: Response, next: NextFunction) {
    try {
        const { walletId } = req.params

        const wallet = await new Wallet({ walletId }).getWalletData()

        return res.status(200).json({...wallet, amountCents: wallet.amountCents.toString()})
    } catch (error) {
        next(error)

    }
}
