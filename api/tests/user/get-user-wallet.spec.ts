import { beforeEach, describe, expect, it, vi } from "vitest";
import { redisClient } from "../../src/lib/redis/index.js";
import { getAllUserWallets } from "../../src/controllers/user/index.js";
import { prisma } from "../../src/lib/prisma/index.js";

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
})
