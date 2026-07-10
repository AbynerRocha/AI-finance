import type { User } from "../../generated/prisma/client.js";
import { AuthError, UserError } from "../../utils/error.js";
import { getUser, verifyUserPassword } from "../user/index.js";
import argon2 from 'argon2'
import { generateAuthToken, type AccessLevel } from "./token/index.js";

export async function loginUser(email: string, password: string) {

    let user = await getUser({ email })
    
    if (!user) {
        throw UserError.userNotFound()
    }

    const matchPassword = await verifyUserPassword(password, user.email)

    if(!matchPassword) {
        throw AuthError.invalidCredentials()
    }

    const authToken = await generateAuthToken(user.id, user.accessLevel as AccessLevel)

    return { user, authToken }
}


export async function hashPassword(password: string) {
    return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16, // 64mb
        timeCost: 4,
        parallelism: 4,
    })
}
