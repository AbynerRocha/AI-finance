import jwt from 'jsonwebtoken'
import { env } from '../../../env.js'

const secret = env.JWT_SECRET

export type AccessLevel = 'user' | 'admin'

export async function generateAuthToken(userId: string, accessLevel: AccessLevel, duration: number=(60*60*24*7)) {
    const token = jwt.sign({ userId, accessLevel }, secret, { expiresIn: duration })

    return token
}

export async function validateAuthToken(token: string) {
    try {
        const verified = jwt.verify(token, secret)

        return !!verified
    } catch (error) {
        throw error
    }
}
