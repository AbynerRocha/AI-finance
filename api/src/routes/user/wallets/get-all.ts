import type { NextFunction } from "express";
import type { getAllWalletsRequest } from "../../wallet.routes.js";
import { AuthError } from "../../../utils/error.js";
import { getDataFromToken } from "../../../controllers/auth/token/index.js";

export async function getAllWalletsRoute(req: getAllWalletsRequest, res: Response, next: NextFunction) {
    const accessToken = req.headers.authorization

    if(!accessToken) {
        throw AuthError.notAuthorized()
    }

    const { userId } = await getDataFromToken(accessToken)


}
