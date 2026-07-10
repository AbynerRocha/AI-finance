import type { NextFunction, Request, Response } from "express";
import type { GetUserRequest } from "../user.routes.js";
import { getUser } from "../../controllers/user/index.js";
import { AuthError, UserError } from "../../utils/error.js";
import { getDataFromAuthToken } from "../../controllers/auth/token/index.js";

export async function getUserRoute(req: GetUserRequest, res: Response, next: NextFunction) {
    const { id } = req.params
    const token = req.headers.authorization!.replace("Bearer ", "")

    try {
        const tokenData = await getDataFromAuthToken(token)

        // Verifica se quem faz a requisição, é o próprio utilizador ou algum administrador.

        if(tokenData.userId !== id && tokenData.accessLevel !== 'admin'){
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
