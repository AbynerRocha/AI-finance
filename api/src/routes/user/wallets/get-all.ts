import type { NextFunction, Response } from "express";
import type { getAllWalletsRequest } from "../../wallet.routes.js";
import { prisma } from "../../../lib/prisma/index.js";
import { AuthError } from "../../../utils/error.js";

export async function getAllWalletsRoute(req: getAllWalletsRequest, res: Response, next: NextFunction) {
    try { 
        if (!req.user.userId) {
            throw AuthError.notAuthorized()
        }

        const wallets = await prisma.wallet.findMany({ where: { userId: req.user.userId } })

        return res.status(200).json(wallets.map((v) => ({...v, amountCent: v.amountCent.toString() })))
    } catch (error) {
        next(error)
    }
}
