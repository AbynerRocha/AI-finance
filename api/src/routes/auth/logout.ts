import type { NextFunction, Request, Response } from "express";
import { cookieRefreshToken } from "../../utils/cookies.js";
import { revokeRefreshToken } from "../../controllers/auth/token/index.js";


export async function logoutRoute(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies[cookieRefreshToken.name]
        
        if(refreshToken) {
            await revokeRefreshToken(refreshToken)
            res.clearCookie(cookieRefreshToken.name, cookieRefreshToken.options)
        }

        res.status(200).send()
    } catch (error) {
        next(error)
    }
}
