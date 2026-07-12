import type { NextFunction, Request, Response } from "express";
import type { GetUserRequest } from "../user.routes.js";
import { getUser } from "../../controllers/user/index.js";
import { AuthError, UserError } from "../../utils/error.js";
import { getDataFromToken } from "../../controllers/auth/token/index.js";

export async function getUserRoute(req: GetUserRequest, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
        // Verifica se quem faz a requisição, é o próprio utilizador ou algum administrador.
        console.log(req.user)
        if(req.user.userId !== id && req.user.accessLevel !== 'admin'){
            throw AuthError.notAuthorized()
        }

        const user = await getUser({ id })

        if (user === null) {
            throw UserError.userNotFound()
        }

        return res.status(200).json(user)
    } catch (error) {
        return next(error)
    }
}
