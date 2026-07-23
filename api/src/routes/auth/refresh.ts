import type { NextFunction, Response, Request } from "express";
import { generateAccessToken, generateRefreshToken, getDataFromToken, revokeRefreshToken, validateRefreshToken } from "../../controllers/auth/token/index.js";
import { AuthError } from "../../utils/error.js";
import { cookieRefreshToken } from "../../utils/cookies.js";
import { refreshSchema } from "../../schemas/auth.schemas.js";
import { z } from "zod";
import { defaultErrorSchema } from "../../schemas/errors.schemas.js";
import { registerRoute } from "../../docs/helper.js";

registerRoute({
    tags: ['🔒 auth'],
    path: "/auth/refresh",
    method: "post",
    request: {
        cookies: refreshSchema.shape.cookies
    },
    responses: {
        200: {
            headers: z.object({
                'Set-Cookie': z.string().openapi({
                    description: "Set a new refresh token",
                    example: "refresh_token=;Path=\;Expires=Thu, 01 Jan 1970 00:00:00 GMT;HttpOnly"
                })
            })
        },
        401: {
            content: {
                "application/json": {
                    schema: defaultErrorSchema
                }
            }
        },
    }
})

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
