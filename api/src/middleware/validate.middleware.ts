import { getDataFromToken, validateToken } from "../controllers/auth/token/index.js";
import { AuthError } from "../utils/error.js";
import type { NextFunction, Request, Response } from "express";
import type { ZodObject } from "zod";

export const validate = (schema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({ body: req.body, query: req.query, params: req.params, cookies: req.cookies, headers: req.headers })
        
        if(req.headers.authorization) {
            const accessToken = req.headers.authorization.replace('Bearer ', '')
            const validToken = await validateToken(accessToken)
            
            if (!validToken) {
                throw AuthError.invalidToken()
            }
            
            req.user = await getDataFromToken(accessToken)
        }
        
        return next()
    } catch (error) {
        // Vai para o middleware de erros
        return next(error)
    }
}
