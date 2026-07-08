import type { NextFunction, Request, Response } from "express";
import type { LoginRequest } from "../auth.routes.js";
import { loginUser } from "../../controllers/auth/index.js";

export async function loginRoute(req: LoginRequest, res: Response, next: NextFunction) {
    const { email, password } = req.body
    try {
        const { authToken, user } = await loginUser(email, password)
        
        res.cookie("finance_token", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7 // 7d
        })
        res.status(200).json(user)
    } catch (error) {
        return next(error)
    }
}
