import z from "zod";
import { AuthError } from "../utils/error.js";

export const createWalletSchema = z.object({
    body: z.object({
        name: z.string()  
    }),
    headers: z.looseObject({
        authorization: z.string().startsWith("Bearer ", AuthError.notAuthorized().message)
    })
})

export const getAllWalletsSchema = z.object({
    headers: z.looseObject({
        authorization: z.string().startsWith("Bearer ", AuthError.notAuthorized().message)
    })
})


export type CreateWalletSchema = z.infer<typeof createWalletSchema>
export type getAllWalletsSchema = z.infer<typeof getAllWalletsSchema>