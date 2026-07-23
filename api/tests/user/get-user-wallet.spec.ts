import { beforeEach, describe, expect, it, vi } from "vitest";
import { redisClient } from "../../src/lib/redis/index.js";
import { getAllUserWallets } from "../../src/controllers/user/index.js";
import { prisma } from "../../src/lib/prisma/index.js";
import { walletQueryIncludeLastTransaction } from "../../src/controllers/wallet/queries.js";
import { DEFAULT_TTL_CACHE } from "../../src/utils/constants.js";

vi.mock('../../src/lib/prisma/index.js', () => ({
    prisma: {
        wallet: {
            findMany: vi.fn()
        }
    }
}))

vi.mock('../../src/lib/redis/index.js', () => ({
    redisClient: {
        get: vi.fn(),
        set: vi.fn()
    }
}))

describe("User getAllUserWallets", () => {
    const mockUserId = "user-123"

    const cachedWallets = [
        {
            id: "wallet-123",
            name: "Carteira",
            userId: mockUserId,
            type: "MAIN",
            category: null,
            currency: "BRL",
            amountCents: "0",
            createdAt: "2026-01-01T00:00:00.0000Z"
        }
    ]

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("Should return users wallets from cache when cache exists", async () => {
        vi.mocked(redisClient.get).mockResolvedValue(JSON.stringify(cachedWallets))

        const wallets = await getAllUserWallets(mockUserId)

        expect(redisClient.get).toHaveBeenCalledWith(`user:wallets:${mockUserId}`)
        expect(prisma.wallet.findMany).not.toHaveBeenCalled()
        expect(redisClient.set).not.toHaveBeenCalled()
        expect(wallets).toEqual(cachedWallets)
    })

    it("Should fecth wallets from DB and save in cache when cache is empty", async () => {
        const mockDbWallets = [
            {
                id: 'wallet-123',
                name: 'Carteira Principal',
                type: 'MAIN',
                userId: mockUserId,
                currency: 'BRL',
                amountCents: 0,
                createdAt: new Date('2026-01-01T00:00:00.000Z'),
                WalletCategories: { name: 'teste' },
                Transactions: [
                    {
                        id: 'tx-1',
                        type: 'INCOME',
                        date: new Date('2026-01-01T00:00:00.000Z'),
                        walletId: 'wallet-123',
                        amountCents: 1000,
                        isPaid: true,
                        transactionsCategories: { name: 'Teste 2' },
                    },
                ],
            },
        ]

        vi.mocked(redisClient.get).mockResolvedValue(null)
        vi.mocked(prisma.wallet.findMany).mockResolvedValue(mockDbWallets as any)

        const wallets = await getAllUserWallets(mockUserId)

        expect(prisma.wallet.findMany).toHaveBeenCalledWith({
            where: { userId: mockUserId },
            include: walletQueryIncludeLastTransaction
        })

        expect(redisClient.set).toHaveBeenCalledWith(`user:wallets:${mockUserId}`,
            expect.stringContaining('wallet-123'),
            { expiration: { type: "EX", value: DEFAULT_TTL_CACHE } }
        )

        expect(wallets[0]).toMatchObject({
            id: 'wallet-123',
            name: 'Carteira Principal',
            category: 'teste',
            lastTransaction: expect.objectContaining({
                id: 'tx-1',
                category: 'Teste 2',
            })
        })
    })
})
