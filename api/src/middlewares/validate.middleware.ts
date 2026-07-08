import type { NextFunction, Request, Response } from "express";
import { type ZodObject } from "zod";
import { validateAuthToken } from "../controllers/auth/token/index.js";
import { AuthError } from "../utils/error.js";

export const validate = (schema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({ body: req.body, query: req.query, params: req.params, headers: req.headers })

        if(req.headers.authorization) {
            if (!(await validateAuthToken(req.headers.authorization))) {
                throw AuthError.invalidToken()
            }
        }


        return next()
    } catch (error) {
        // Vai para o middleware de erros
        return next(error)
    }
}
