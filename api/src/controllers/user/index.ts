import argon2 from "argon2";
import { prisma } from "../../lib/prisma/index.js";
import { redisClient } from "../../lib/redis/index.js";
import { AppError, UserError } from "../../utils/error.js";
import { hashPassword } from "../auth/index.js";
import type { CreateUserSchemaType } from "../../schemas/user.schemas.js";
import { Prisma, type Transactions, type User } from "../../generated/prisma/client.js";
import { treatWalletData, Wallet } from "../wallet/index.js";
import type { WalletData } from "../../schemas/wallet.schemas.js";
import { walletFullInclude, walletQueryIncludeLastTransaction } from "../wallet/queries.js";
import { DEFAULT_TTL_CACHE } from "../../utils/constants.js";


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

        await saveUserInCache(createdUser)

        return createdUser
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw UserError.userExists()
        }
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

    if (!user) return false

    return argon2.verify(user.password, password)
}

export async function isThisUserCached({ id, email }: { id: string | undefined, email: string | undefined }) {
    const key = id ? `user:id:${id}` : email ? `user:email:${email}` : ``

    const cachedData = await redisClient.get(key)

    return cachedData ? JSON.parse(cachedData) as Omit<User, 'password'> : null
}

export async function saveUserInCache(user: Omit<User, 'password'>) {
    const idKey = `user:id:${user.id}`
    const emailKey = `user:email:${user.email}`

    try {
        await Promise.all([
            redisClient.set(idKey, JSON.stringify(user), { expiration: { type: "EX", value: DEFAULT_TTL_CACHE } }),
            redisClient.set(emailKey, JSON.stringify(user), { expiration: { type: "EX", value: DEFAULT_TTL_CACHE } })
        ])
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function getAllUserWallets(id: string) {
    try {
        const cacheKey = `user:wallets:${id}`
        const cachedWallets = await redisClient.get(cacheKey)

        if (cachedWallets) {
            const data = JSON.parse(cachedWallets) as WalletData[]

            if (data.length > 0) {
                return data
            }
        }

        let wallets = await prisma.wallet.findMany({
            where: {
                userId: id
            },
            include: walletQueryIncludeLastTransaction
        })

        const treatedWalletData = wallets.map((wallet) => treatWalletData(wallet, true))

        await redisClient.set(cacheKey, JSON.stringify(treatedWalletData), { expiration: { type: "EX", value: DEFAULT_TTL_CACHE } })

        return treatedWalletData
    } catch (error) {
        throw error
    }
}

export async function getUserBalance(id: string) {
    try {
        const cacheKey = `user:balance:${id}`

        const balanceCached = await redisClient.get(cacheKey)

        if (balanceCached) {
            return BigInt(balanceCached)
        }

        const { _sum: { amountCents } } = await prisma.wallet.aggregate({
            where: {
                userId: id
            },
            _sum: {
                amountCents: true
            }
        })

        if(!amountCents) {
            throw new AppError({
                message: "Não foi possível consultar o seu saldo. Por favor tente novamente mais tarde.",
                name: "CANNOT_GET_BALANCE",
                statusCode: 500
            })
        }

        redisClient.set(cacheKey, amountCents.toString())

        return amountCents
    } catch (error) {
        throw error
    }
}

