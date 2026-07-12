import type { NextFunction, Request, Response } from "express";
import type { LoginRequest } from "../auth.routes.js";
import { loginUser } from "../../controllers/auth/index.js";
import { cookieAuthToken } from "../../utils/cookies.js";

export async function loginRoute(req: LoginRequest, res: Response, next: NextFunction) {
    const { email, password } = req.body
    try {
        const { authToken, user } = await loginUser(email, password)
        
        res.cookie(cookieAuthToken.name, authToken, cookieAuthToken.options)
        res.status(200).json()
    } catch (error) {
        return next(error)
    }
}
