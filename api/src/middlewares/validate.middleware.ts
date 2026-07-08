import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodObject } from "zod";

export const validate = (schema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({ body: req.body, query: req.query, params: req.params, headers: req.headers })

        return next()
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: 'VALIDATION_ERROR',
                issues: error.issues.map(err => ({
                    field: err.path[1],
                    message: err.message
                }))
            })
        }
    }
    return res.status(500).json({
        error: "SERVER_INTERNAL_ERROR",
        message: "Ocorreu um erro no servidor. Por favor tente novamente mais tarde."
    })
}
