import type { Response, NextFunction } from "express";
import type { RegisterUserRequest } from "../auth.routes.js";
import { createUser } from "../../controllers/user/index.js";
import { generateAuthToken, type AccessLevel } from "../../controllers/auth/token/index.js";
import { cookieAuthToken } from "../../utils/cookies.js";

export async function registerUserRoute(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const { name, email, password } = req.body

    try {
        const user = await createUser({ name, email, password })
        const authToken = await generateAuthToken(user.id, user.accessLevel as AccessLevel)

        res.cookie(cookieAuthToken.name, authToken, cookieAuthToken.options)
        return res.status(201).json(user)
    } catch (error) {
        next(error)
    }
}
