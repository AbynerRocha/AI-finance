import { z } from "zod";
import { AuthError } from "../utils/error.js";

export const validationErrorSchema = z.object({
    name: z.string().openapi({
        description: "Error name",
        example: "EXPIRED_TOKEN"
    }),
    message: z.string().openapi({
        description: "Message to show to user",
        example: "Sessão expirada."
    }),
    issues: z.optional(z.array(z.object({
        target: z.string().openapi({
            description: "Field target to attach error",
            example: "email"
        }),
        message: z.string().openapi({
            description: "Message to attach",
            example: "Email inválido."
        })
    })))
})

const expiredAccessToken = AuthError.expiredAccessToken()

export const defaultErrorSchema = z.object({
    name: z.string().openapi({
        description: "Error name",
        example: expiredAccessToken.name
    }),
    message: z.string().openapi({
        description: "Message to show to user",
        example: expiredAccessToken.message
    }),
    redirect: z.optional(z.string().openapi({
        description: "URL to redirect user",
        example: expiredAccessToken.redirect
    }))
})
