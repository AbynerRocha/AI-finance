import type { NextFunction, Response } from "express";
import type { getAllWalletsRequest } from "../../wallet.routes.js";
import { prisma } from "../../../lib/prisma/index.js";
import { AuthError } from "../../../utils/error.js";
import { getDataFromToken } from "../../../controllers/auth/token/index.js";

export async function getAllWalletsRoute(req: getAllWalletsRequest, res: Response, next: NextFunction) {
    try {
        const accessToken = req.headers.authorization

        if (!accessToken) {
            throw AuthError.notAuthorized()
        }

        const { userId } = await getDataFromToken(accessToken)
        const wallets = await prisma.wallet.findMany({ where: { userId } })

        return res.status(200).json(wallets)
    } catch (error) {
        next(error)
    }
}
