import type { NextFunction, Request, Response } from "express";
import type { GetUserRequest } from "../user.routes.js";
import { getUser } from "../../controllers/user/index.js";
import { AppError, UserError } from "../../utils/error.js";

export async function getUserRoute(req: GetUserRequest, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
        const user = await getUser({ id })

        if (user === null) {
            throw UserError.userNotFound()
        }

        return res.status(200).json(user)
    } catch (error) {
        return next(error)
    }
}
