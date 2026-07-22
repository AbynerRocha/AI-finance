import { prisma } from "../../lib/prisma/index.js";
import { redisClient } from "../../lib/redis/index.js";
import { WalletError } from "../../utils/error.js";
import type { WalletData } from "../../schemas/wallet.schemas.js";
import { walletQueryIncludeLastTransaction } from "./queries.js";
import { DEFAULT_CURRENCY, DEFAULT_TTL_CACHE } from "../../utils/constants.js";


const serializeLastTransaction = (lastTransaction?: WalletData['lastTransaction']) =>
    lastTransaction
        ? JSON.stringify(lastTransaction, (_, value) =>
            typeof value === 'bigint' ? value.toString() : value
        )
        : ''

export class Wallet {
    private readonly walletId: string;
    private balance: bigint | undefined;

    constructor({ walletId }: { walletId: string }) {
        this.walletId = walletId
    }

    static async createWallet({ name, userId }: { name: string, userId: string }) {
        try {
            const wallet = await prisma.wallet.create({
                data: {
                    name,
                    type: "MAIN",
                    userId,
                    category: null 
                },
                include: walletQueryIncludeLastTransaction
            })

            const treatedWalletData = {
                ...wallet,
                category: wallet.WalletCategories?.name ?? null,
                lastTransaction: {
                    ...wallet.Transactions[0],
                    category: wallet.Transactions[0]?.transactionsCategories?.name ?? '',
                },
                WalletCategories: undefined
            }

            await Wallet.saveWalletInCache(treatedWalletData as WalletData)

            return new Wallet({ walletId: wallet.id })
        } catch (error) {

            console.log(error)
            throw error
        }
    }

    async getWalletData() {
        const cachedWallet = await Wallet.isWalletInCache(this.walletId)

        if (cachedWallet) {
            return cachedWallet
        }

        const wallet = await prisma.wallet.findUnique({
            where: { id: this.walletId },
            include: walletQueryIncludeLastTransaction
        })

        if (wallet === null) {
            throw WalletError.walletNotFound()
        }

        const treatedWalletData = {
            ...wallet,
            category: wallet.WalletCategories?.name ?? null,
            lastTransaction: {
                ...wallet.Transactions[0],
                category: wallet.Transactions[0]?.transactionsCategories?.name ?? '',
            },
            WalletCategories: undefined
        }

        Wallet.saveWalletInCache(treatedWalletData as WalletData)

        return treatedWalletData
    }

    async getBalance() {
        const cached = await Wallet.isWalletInCache(this.walletId)

        if (cached) {
            this.balance = BigInt(cached.amountCents)
            return this.balance
        }

        const wallet = await prisma.wallet.findUnique({
            where: {
                id: this.walletId
            },
            select: { amountCents: true }
        })

        if (!wallet) throw WalletError.walletNotFound()

        this.balance = BigInt(wallet.amountCents)

        return this.balance
    }

    async addBalance(amount: bigint) {
        try {
            if (amount <= 0n) {
                throw WalletError.invalidAmount()
            }

            const success = await prisma.wallet.update({
                where: {
                    id: this.walletId,
                },
                data: {
                    amountCents: {
                        increment: amount
                    }
                }
            })

            const cacheKey = `wallet:${this.walletId}`
            const exists = await redisClient.exists(cacheKey)

            /*
                se existir o cache ele faz o incrBy e atuliza o this.balance
                caso nao exista ele invalida o this.balance para quando for pegar novamente no getBalance, o dado continuar atulizado
            */

            if (exists) {
                const newBalance = await redisClient.hIncrBy(cacheKey, 'amountCents', Number(amount))
                this.balance = BigInt(newBalance)

                return !!success
            }

            this.balance = undefined

            return !!success
        } catch (error) {
            throw error
        }
    }

    async removeBalance(amount: bigint) {
        try {
            if (amount <= 0n) {
                throw WalletError.invalidAmount()
            }

            const success = await prisma.wallet.updateMany({
                where: {
                    id: this.walletId,
                    amountCents: {
                        gte: amount
                    }
                },
                data: {
                    amountCents: {
                        decrement: amount
                    }
                }
            })

            if (success.count === 0) {
                return false
            }

            return true
        } catch (error) {
            throw error
        }
    }

    static async isWalletInCache(walletId: string): Promise<WalletData | null> {
        const cachedWallet = await redisClient.hGetAll(`wallet:${walletId}`)

        if (!cachedWallet || Object.keys(cachedWallet).length === 0) {
            return null
        } else if (!cachedWallet.id || !cachedWallet.userId || !cachedWallet.createdAt) {
            return null
        }

        let amountCents: bigint
        let lastTransaction: WalletData['lastTransaction'] | undefined

        try {
            amountCents = BigInt(cachedWallet.amountCents ?? '0')
            if (cachedWallet.lastTransaction) {
                lastTransaction = JSON.parse(cachedWallet.lastTransaction) as WalletData['lastTransaction']
            }
        } catch {
            lastTransaction = undefined
            return null
        }


        return {
            id: cachedWallet.id,
            userId: cachedWallet.userId,
            name: cachedWallet.name ?? '',
            type: cachedWallet.type ?? 'MAIN',
            currency: cachedWallet.currency ?? DEFAULT_CURRENCY,
            category: cachedWallet.category,
            amountCents,
            createdAt: cachedWallet.createdAt ? new Date(cachedWallet.createdAt) : new Date(),
            lastTransaction
        }
    }

    static async saveWalletInCache(data: Partial<WalletData>) {
        const { id, userId, name = '', type = 'MAIN', currency = DEFAULT_CURRENCY, amountCents = BigInt(0), createdAt = new Date() } = data

        if (!id || !userId) return

        const cacheKey = `user:wallet:${userId}`

        const exists = await redisClient.exists(cacheKey)

        if (exists) {
            const cachedData = await redisClient.get(cacheKey)

            if (cachedData) {
                const wallets = JSON.parse(cachedData)

                wallets.push({
                    id,
                    userId,
                    name,
                    type,
                    currency,
                    amountCents: amountCents.toString(),
                    createdAt: createdAt.toISOString(),
                    lastTransaction: serializeLastTransaction(data.lastTransaction)
                })

                await redisClient.set(cacheKey, JSON.stringify(wallets))
                await redisClient.expire(cacheKey, DEFAULT_TTL_CACHE)
                return
            }
        }

        await redisClient.set(cacheKey, JSON.stringify([
            {
                id,
                userId,
                name,
                type,
                currency,
                amountCents: amountCents.toString(),
                createdAt: createdAt.toISOString(),
                lastTransaction: serializeLastTransaction(data.lastTransaction)
            }
        ]))
        await redisClient.expire(cacheKey, DEFAULT_TTL_CACHE)
    }
}

