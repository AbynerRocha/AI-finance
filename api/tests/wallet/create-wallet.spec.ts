import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Wallet } from '../../src/controllers/wallet/index.js';
import { walletQueryIncludeLastTransaction } from '../../src/controllers/wallet/queries.js';
import { prisma } from '../../src/lib/prisma/index.js';
import { redisClient } from '../../src/lib/redis/index.js';

vi.mock('../../src/lib/prisma/index.js', () => ({
    prisma: {
        wallet: {
            create: vi.fn()
        }
    }
}))

vi.mock('../../src/lib/redis/index.js', () => ({
    redisClient: {
        exists: vi.fn(),
        get: vi.fn(),
        set: vi.fn(),
        expire: vi.fn(),
    },
}))

describe("Wallet - Create Wallet", () => {
    const mockUserId = 'user-123'
    const mockWalletName = 'Carteira Principal'

    const mockDbWalletResponse = {
        id: 'wallet-123',
        name: mockWalletName,
        type: 'MAIN',
        userId: mockUserId,
        currency: 'BRL',
        amountCents: 0n,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        WalletCategories: {
            name: "teste"
        },
        Transactions:[
            {
                id: 'tx-1',
                type: 'INCOME',
                date: new Date('2026-01-01T00:00:00.000Z'),
                walletId: 'wallet-123',
                amountCents: 1000n,
                isPaid: true,
                transactionsCategories: {
                    name: "Teste 2"
                }
            }
        ]
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("Should create a wallet on DB and save on cache", async () => {
        vi.mocked(prisma.wallet.create).mockResolvedValue(mockDbWalletResponse as any)

        vi.mocked(redisClient.exists).mockResolvedValue(0)

        const wallet = await Wallet.createWallet({
            name: mockWalletName,
            userId: mockUserId
        })

        expect(wallet).toBeInstanceOf(Wallet)
        expect(prisma.wallet.create).toHaveBeenCalledWith({
            data: {
                name: mockWalletName,
                type: 'MAIN',
                userId: mockUserId,
                category: null
            },
            include: walletQueryIncludeLastTransaction,
        })

        expect(redisClient.set).toHaveBeenCalledWith(
            `user:wallet:${mockUserId}`,
            expect.stringContaining('wallet-123')
        )
        expect(redisClient.expire).toHaveBeenCalledTimes(1)
    })
})