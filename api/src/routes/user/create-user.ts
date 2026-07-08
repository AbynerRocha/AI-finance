import type { NextFunction, Response } from "express";
import type { CreateUserRequest } from "../user.routes.js";
import { createUser } from "../../controllers/user/index.js";


export async function createUserRoute(req: CreateUserRequest, res: Response, next: NextFunction) {
    try {
        const { name, email, password } = req.body
    
        const userId = await createUser({ name, email, password })
        
        return res.status(201).json(userId)
    } catch (error) {
        return next(error)
    }
} 