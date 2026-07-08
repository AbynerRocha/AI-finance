import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/error.js";

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    if(error instanceof AppError) {
        return res.status(error.statusCode).json({
            error: error.error,
            message: error.message
        })
    }

    console.error("❌ Erro critíco: ", error)

    return res.status(500).json({
        error: error.name,
        message: error.message
    })
}
