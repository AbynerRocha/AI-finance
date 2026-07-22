import { prisma } from "../../lib/prisma/index.js";
import { redisClient } from "../../lib/redis/index.js";
import type { Transaction } from "../../schemas/transaction.schemas.js";
import { DEFAULT_TTL_CACHE } from "../../utils/constants.js";

export async function getWalletTransactions(
    walletId: string,
    userId: string,
    page: number = 1,
    limit: number = 50
) {
    const cacheKey = `wallet:transactions:${walletId}:page:${page}:limit:${limit}`

    const cachedTransactions = await redisClient.get(cacheKey)

    if (cachedTransactions) return JSON.parse(cachedTransactions) as Transaction[]

    const skip = (page - 1) * limit

    const [transactions, total] = await prisma.$transaction([
        prisma.transactions.findMany({
            where: {
                walletId,
                wallet: { userId },
            },
            include: {
                transactionsCategories: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                date: "desc"
            },
            skip,
            take: limit

        }),
        prisma.transactions.count({
            where: {
                walletId,
                wallet: {
                    userId
                }
            }
        })
    ])

    const result = {
        transactions: transactions.map((transaction) => ({
            ...transaction,
            category: transaction.transactionsCategories?.name,
            transactionsCategories: undefined
        })),
        pagenation: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }

    await redisClient.set(cacheKey, JSON.stringify(result), { expiration: { type: "EX", value: DEFAULT_TTL_CACHE } })

    return result
}
