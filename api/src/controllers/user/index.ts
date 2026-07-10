import argon2 from "argon2";
import { prisma } from "../../lib/prisma/index.js";
import { redisClient } from "../../lib/redis/index.js";
import { UserError } from "../../utils/error.js";
import { hashPassword } from "../auth/index.js";
import type { CreateUserSchemaType } from "../../schemas/user.schemas.js";
import type { User } from "../../generated/prisma/client.js";

export async function thisUserExists({ id, email }: { id?: string, email?: string }) {
    try {
        if (!id && !email) return false

        const orConditions = []

        if (id) orConditions.push({ id })
        if (email) orConditions.push({ email })

        const user = await prisma.user.findFirst({
            where: {
                OR: orConditions
            },
            select: {
                _count: true
            }
        })

        return !!user
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function createUser({ name, email, password }: CreateUserSchemaType['body']) {
    try {
        const exists = await thisUserExists({ email })

        if (exists) {
            throw UserError.userExists()
        }

        const hashPass = await hashPassword(password)

        const createdUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPass
            },
            omit: {
                password: true
            }
        })

        saveUserInCache(createdUser)

        return createdUser
    } catch (error) {
        throw error
    }
}

export async function getUser({ id, email }: { id?: string, email?: string }) {
    try {
        if (!id && !email) return null

        const cachedUser = await isThisUserCached({ id, email })

        if (cachedUser !== null) {
            return cachedUser
        }

        const orConditions = []

        if (id) orConditions.push({ id })
        if (email) orConditions.push({ email })

        const user = await prisma.user.findFirst({
            where: {
                OR: orConditions
            },
            omit: {
                password: true
            }
        })

        if (user) {
            saveUserInCache(user)
        }

        return user
    } catch (error) {
        throw error
    }
}

export async function verifyUserPassword(password: string, email: string) {
    const user = await prisma.user.findFirst({
        where: {
            email
        },
        select: {
            password: true
        }
    })

    if(!user) return false

    return argon2.verify(user.password, password)
}

export async function isThisUserCached({ id, email }: { id: string | undefined, email: string | undefined }) {
    const key = id ? `user:id${id}` : email ? `user:email:${email}` : ``

    const cachedData = await redisClient.get(key)

    return cachedData ? JSON.parse(cachedData) as Omit<User, 'password'> : null
}

export async function saveUserInCache(user: Omit<User, 'password'>) {
    try {
        const idKey = `user:id:${user.id}`
        const emailKey = `user:email:${user.email}`

        redisClient.set(idKey, JSON.stringify(user))
        redisClient.set(emailKey, JSON.stringify(user))
    } catch (error) {
        console.error(error)
        throw error
    }
}
