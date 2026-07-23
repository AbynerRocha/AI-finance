import type { NextFunction, Response } from "express";
import type { CreateUserRequest } from "../user.routes.js";
import { createUser } from "../../controllers/user/index.js";
import { createUserSchema, getUserSchema, userSchema } from "../../schemas/user.schemas.js";
import { defaultErrorSchema } from "../../schemas/errors.schemas.js";
import { registerRoute } from "../../docs/helper.js";
import { AuthError } from "../../utils/error.js";

registerRoute({
    tags: ['👤 user'],
    method: "post",
    path: "/user/create",
    description: "Create a new user (only for admins)",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: createUserSchema.shape.body
                }
            }
        },
        headers: getUserSchema.shape.headers
    },
    responses: {
        201: {
            description: "User created successfully"
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

export async function createUserRoute(req: CreateUserRequest, res: Response, next: NextFunction) {
    try {
        if(req.user.accessLevel !== 'admin') {
            throw AuthError.notAuthorized()
        }

        const { name, email, password } = req.body
    
        await createUser({ name, email, password })
        
        return res.status(201).json()
    } catch (error) {
        return next(error)
    }
} 