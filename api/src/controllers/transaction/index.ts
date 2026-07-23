import { z } from "zod";
import { prisma } from "../../lib/prisma/index.js";
import { redisClient } from "../../lib/redis/index.js";
import { transactionSchema, type Transaction } from "../../schemas/transaction.schemas.js";
import { DEFAULT_TTL_CACHE } from "../../utils/constants.js";
import { Wallet } from "../wallet/index.js";
import { WalletError } from "../../utils/error.js";

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

const createTransactionSchema = transactionSchema.required({
    type: true,
    amountCents: true,
    isPaid: true,
    walletId: true
}).omit({ id: true })

export async function createTransaction(data: z.infer<typeof createTransactionSchema>) {
    try {
        if(data.amountCents <= 0n) {
            throw WalletError.invalidAmount()
        }

        const wallet = new Wallet({ walletId: data.walletId })
        const walletExists = await wallet.exists()

        if(!walletExists) {
            throw WalletError.walletNotFound()
        }

        const newTransaction = await prisma.transactions.create({
            data: {
                description: data.description ?? null,
                category: data.categoryId ?? null,
                type: data.type,
                isPaid: data.isPaid,
                walletId: data.walletId,
                amountCents: data.amountCents,
                date: data.date,
                parcel: data.parcel ?? null,
                numberOfParcels: data.numberOfParcels ?? null
            }
        })

        return newTransaction
    } catch (error) {
        throw error
    }
}
