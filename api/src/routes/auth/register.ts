import type { Response, NextFunction } from "express";
import type { RegisterUserRequest } from "../auth.routes.js";
import { createUser } from "../../controllers/user/index.js";
import { generateAccessToken, generateRefreshToken } from "../../controllers/auth/token/index.js";
import { cookieRefreshToken } from "../../utils/cookies.js";
import type { AccessLevel } from "../../@types/access-level.js";

export async function registerUserRoute(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const { name, email, password } = req.body

    try {
        const user = await createUser({ name, email, password })
        const refreshToken = await generateRefreshToken(user.id, user.accessLevel as AccessLevel)
        const accessToken = await generateAccessToken(user.id, user.accessLevel as AccessLevel)

        res.cookie(cookieRefreshToken.name, refreshToken, cookieRefreshToken.options)
        return res.status(201).json(accessToken)
    } catch (error) {
        next(error)
    }
}
