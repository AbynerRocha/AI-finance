import type { NextFunction, Request, Response } from "express";
import { AppError, AuthError } from "../utils/error.js";
import { ZodError } from "zod";

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error.name === 'JsonWebTokenError') {
        error = AuthError.invalidToken()
    } else if (error.name === 'TokenExpiredError') {
        error = new AuthError({
            name: 'EXPIRED_TOKEN',
            message: "Você não está autorizado para esta ação.",
            statusCode: 401
        })
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            error: error.name,
            message: error.message,
            issues: error.issues
        })
    } else if (error instanceof ZodError) {
        return res.status(400).json({
            error: 'VALIDATION_ERROR',
            issues: error.issues.map(err => ({
                field: err.path[1],
                message: err.message
            }))
        })
    }


    console.error("❌ Erro critíco: ", error)

    return res.status(500).json({
        error: error.name,
        message: error.message
    })
}
