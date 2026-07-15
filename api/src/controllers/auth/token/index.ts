import jwt from 'jsonwebtoken'
import { env } from '../../../env.js'
import { AuthError } from '../../../utils/error.js'
import { prisma } from '../../../lib/prisma/index.js';
import type { AccessLevel } from '../../../@types/access-level.js';

const secret = env.JWT_SECRET
const ACCESS_TOKEN_DURATION = 60*15 // 15 minutos
export const REFRESH_TOKEN_DURATION = 60*60*24*30 // 30 dias


export async function generateAccessToken(userId: string, accessLevel: AccessLevel) {
    const token = jwt.sign({ userId, accessLevel }, secret, { expiresIn: ACCESS_TOKEN_DURATION })

    return token
}

// Refresh Tokens 

export async function generateRefreshToken(userId: string, accessLevel: AccessLevel) {
    try {
        const token = jwt.sign({ userId, accessLevel }, secret, { expiresIn: REFRESH_TOKEN_DURATION })

        await prisma.refreshTokens.create({
            data: {
                userId,
                token,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + REFRESH_TOKEN_DURATION * 1000),
            }
        })
        
    
        return token 
    } catch(error) {
        throw error
    }
}

export async function validateRefreshToken(token: string) {
    try {
        const { userId, accessLevel } = jwt.verify(token, secret, { complete: true }).payload as { userId: string, accessLevel: AccessLevel } 

        const exists = await prisma.refreshTokens.findUnique({
            where: {
                token,
                userId
            },
            select: {
                revokedAt: true,
            }
        })
    
        if(!exists) {
            throw AuthError.invalidToken()
        } else if(exists.revokedAt) {
            throw AuthError.expiredRefreshToken()
        }

        return {
            userId,
            accessLevel
        }
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError) {
            revokeRefreshToken(token)

            throw AuthError.expiredRefreshToken()
        }
        
        throw error
    }
}

export async function revokeRefreshToken(token: string) {
    await prisma.refreshTokens.update({
        where: { token },
        data: { revokedAt: new Date(Date.now()) }
    })
}

export async function validateToken(token: string) {
    try {
        const verified = jwt.verify(token, secret)

        return !!verified
    } catch (error) {
        throw error
    }
}

export async function getDataFromToken(token: string) {
    try {
        const decoded = jwt.verify(token, secret, { complete: true })
        
        if(decoded === null) {
            throw AuthError.invalidToken()
        }

        return decoded.payload as { userId: string, accessLevel: AccessLevel }
    } catch (error) {
        throw error
    }
}   