import { prisma } from "../../lib/prisma/index.js";
import { redisClient } from "../../lib/redis/index.js";
import { WalletError } from "../../utils/error.js";
import type { Wallet as WalletData } from '../../generated/prisma/client.js'
import type { DefaultArgs } from "@prisma/client/runtime/client";
import type { WalletSelect } from "../../generated/prisma/models.js";

export class Wallet {
    public readonly walletId: string;
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
            const isCached = await this.isWalletInCache()

            if (isCached) {
                return isCached
            }

            const walletBalance = await prisma.wallet.findUnique({ where: { id: this.walletId }, select })

            if (walletBalance === null) {
                throw WalletError.walletNotFound()
            }

            this.saveWalletInCache(walletBalance)

            return walletBalance
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

    private async isWalletInCache() {
        const isCached = await redisClient.hGetAll(`user:wallet:${this.walletId}`)
        return isCached
    }

    private saveWalletInCache({ id, userId, type, currency,amountCent, createdAt }: WalletData) {
        redisClient.hSet(`user:wallet:${this.walletId}`, {
            id,
            userId,
            type,
            currency,
            amountCent: amountCent.toString(),
            createdAt: createdAt!.toDateString()
        })
    }

}
