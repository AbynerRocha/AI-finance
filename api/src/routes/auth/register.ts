import type { Response, NextFunction } from "express";
import type { RegisterUserRequest } from "../auth.routes.js";
import { createUser } from "../../controllers/user/index.js";
import { generateAccessToken, generateRefreshToken } from "../../controllers/auth/token/index.js";
import { cookieRefreshToken } from "../../utils/cookies.js";
import type { AccessLevel } from "../../@types/access-level.js";
import { defaultErrorSchema } from "../../schemas/errors.schemas.js";
import { registerSchema } from "../../schemas/auth.schemas.js";
import { z } from "zod";
import { registerRoute } from "../../docs/helper.js";

registerRoute({
    tags: ['🔒 auth'],
    path: "/auth/register",
    method: "post",
    description: "Register new user",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: registerSchema.shape.body
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.string().openapi({
                        description: "Acess token"
                    })
                }
            }
        },
        409: {
            content: {
                "application/json": {
                    schema: defaultErrorSchema
                }
            }
        }
    }
})


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
