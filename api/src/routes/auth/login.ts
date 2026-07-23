
import type { NextFunction, Request, Response } from "express";
import type { LoginRequest } from "../auth.routes.js";
import { loginUser } from "../../controllers/auth/index.js";
import { cookieRefreshToken } from "../../utils/cookies.js";
import { z } from "zod";
import { userSchema } from "../../schemas/user.schemas.js";
import { loginSchema } from "../../schemas/auth.schemas.js";
import { registerRoute } from "../../docs/helper.js";

registerRoute({
    tags: ['🔒 auth'],
    path: "/auth/login",
    method: "post",
    description: "Make user login",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: loginSchema.shape.body
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        user: userSchema.omit({ password: true }),
                        accessLevel: z.string()
                    })
                }
            }
        },
        401: {
            content: {
                "application/json": {
                    schema: z.object({
                        name: z.string(),
                        message: z.string(),
                        issues: z.array(z.object({ target: z.string() }))
                    })
                }
            }
        }
    }
})

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
