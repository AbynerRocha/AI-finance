import type { NextFunction, Response } from "express";
import type { GetUserRequest } from "../user.routes.js";
import { getUser } from "../../controllers/user/index.js";
import { AuthError, UserError } from "../../utils/error.js";
import { getUserSchema, userSchema } from "../../schemas/user.schemas.js";
import { z } from 'zod'
import { defaultErrorSchema } from "../../schemas/errors.schemas.js";
import { registerRoute } from "../../docs/helper.js";

const responseUser = userSchema.omit({ password: true })

registerRoute({
    tags: ['👤 user'],
    method: "get",
    path: "/user/{id}",
    request: {
        params: z.object({
            id: z.uuid().openapi({
                description: "User id"
            })
        }),
        headers: getUserSchema.shape.headers
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.object({
                        user: responseUser
                    })
                }
            },
            description: "User found"
        },
        404: {
            content: {
                'application/json': {
                    schema: defaultErrorSchema
                }
            },
            description: "User not found"
        }
    }
})


export async function getUserRoute(req: GetUserRequest, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
        // Verifica se quem faz a requisição, é o próprio utilizador ou algum administrador.
        if(req.user.userId !== id && req.user.accessLevel !== 'admin'){
            throw AuthError.notAuthorized()
        }

        const user = await getUser({ id })

        if (user === null) {
            throw UserError.userNotFound()
        }   

        const data = await responseUser.parseAsync(user)

        return res.status(200).json(data) 
    } catch (error) {
        return next(error)
    }
}
