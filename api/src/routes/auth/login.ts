import type { NextFunction, Request, Response } from "express";
import type { LoginRequest } from "../auth.routes.js";
import { loginUser } from "../../controllers/auth/index.js";
import { cookieRefreshToken } from "../../utils/cookies.js";

export async function loginRoute(req: LoginRequest, res: Response, next: NextFunction) {
    const { email, password } = req.body
    try {
        const { user, accessToken, refreshToken } = await loginUser(email, password)
        
        res.cookie(cookieRefreshToken.name, refreshToken, cookieRefreshToken.options)
        res.status(200).json({ user, accessToken })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}
