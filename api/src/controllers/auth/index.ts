import argon2 from 'argon2'
import { AuthError } from "../../utils/error.js";
import { getUser, verifyUserPassword } from "../user/index.js";
import { generateAccessToken, generateRefreshToken } from "./token/index.js";
import type { AccessLevel } from "../../@types/access-level.js";

export async function loginUser(email: string, password: string) {

    let user = await getUser({ email })
    
    if (!user) {
        throw AuthError.invalidCredentials()
    }

    const matchPassword = await verifyUserPassword(password, user.email)

    if(!matchPassword) {
        throw AuthError.invalidCredentials()
    }

    const refreshToken = await generateRefreshToken(user.id, user.accessLevel as AccessLevel)
    const accessToken = await generateAccessToken(user.id, user.accessLevel as AccessLevel)

    return { user, refreshToken, accessToken }
}

export async function hashPassword(password: string) {
    return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16, // 64mb
        timeCost: 4,
        parallelism: 4,
    })
}
