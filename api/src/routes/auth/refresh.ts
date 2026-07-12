import type { NextFunction, Response, Request } from "express";
import { generateAccessToken, generateRefreshToken, getDataFromToken, revokeRefreshToken, validateRefreshToken } from "../../controllers/auth/token/index.js";
import { AuthError } from "../../utils/error.js";
import { cookieRefreshToken } from "../../utils/cookies.js";

export async function refreshTokenRoute(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies[cookieRefreshToken.name]

        if (!refreshToken) {
            throw AuthError.notAuthorized()
        }

        const { userId, accessLevel } = await validateRefreshToken(refreshToken)

        const accessToken = await generateAccessToken(userId, accessLevel)
        const newRefreshToken = await generateRefreshToken(userId, accessLevel)

        revokeRefreshToken(refreshToken)

        res.cookie(cookieRefreshToken.name, newRefreshToken, cookieRefreshToken.options)
        return res.status(200).json({ accessToken })
    } catch (error) {
        next(error)
    }
}
