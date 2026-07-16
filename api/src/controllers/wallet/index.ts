import { prisma } from "../../lib/prisma/index.js";
import { redisClient } from "../../lib/redis/index.js";
import { WalletError } from "../../utils/error.js";
import type { Wallet as WalletData } from '../../generated/prisma/client.js'
import type { DefaultArgs } from "@prisma/client/runtime/client";
import type { WalletSelect } from "../../generated/prisma/models.js";

export class Wallet {
    private readonly walletId: string;
    private balance?: bigint;

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
                }
            })

            return new Wallet({ walletId: wallet.id })
        } catch (error) {

            console.log(error)
            throw error
        }
    }

    async getWalletData(select: WalletSelect<DefaultArgs> | null = null) {
        try {
            const cachedWallet = await this.isWalletInCache()

            if (cachedWallet) {
                return cachedWallet
            }

            const wallet = await prisma.wallet.findUnique({ where: { id: this.walletId }, select })

            if (wallet === null) {
                throw WalletError.walletNotFound()
            }

            this.saveWalletInCache(wallet)

            return wallet
        } catch (error) {
            throw error
        }
    }

    async getBalance() {
        const walletData = await this.getWalletData({ amountCent: true })

        this.balance = BigInt(walletData.amountCent)

        return walletData.amountCent ? this.balance : BigInt(0)
    }

    async removeBalance(amount: bigint) {
        let walletBallance = this.balance
        
        if(!walletBallance) {
            walletBallance = await this.getBalance()
        }

        if((walletBallance-amount) < 0) {
            throw WalletError.insufficientsFunds()
        }

        walletBallance = walletBallance-amount

        const updatedData = await prisma.wallet.update({
            where: {
                id: this.walletId
            },
            data: {
                amountCent: walletBallance
            }
        })

        this.saveWalletInCache(updatedData)

        return walletBallance
    }

    private async isWalletInCache(): Promise<WalletData | null> {
        const cachedWallet = await redisClient.hGetAll(`user:wallet:${this.walletId}`)

        if (!cachedWallet || Object.keys(cachedWallet).length === 0) {
            return null
        }

        return {
            id: cachedWallet.id,
            userId: cachedWallet.userId,
            name: cachedWallet.name ?? '',
            type: cachedWallet.type as WalletData['type'],
            currency: cachedWallet.currency ?? 'DOL',
            amountCent: BigInt(cachedWallet.amountCent ?? '0'),
            createdAt: cachedWallet.createdAt ? new Date(cachedWallet.createdAt) : new Date(),
        } as WalletData
    }

    private saveWalletInCache({ id, userId, name, type, currency, amountCent, createdAt }: WalletData) {
        redisClient.hSet(`user:wallet:${this.walletId}`, {
            id,
            userId,
            name,
            type,
            currency,
            amountCent: amountCent.toString(),
            createdAt: createdAt.toISOString()
        })
    }

}
