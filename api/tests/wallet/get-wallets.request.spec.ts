import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { app } from '../../src/server.js'
import { generateAccessToken } from '../../src/controllers/auth/token/index.js'
import { prisma } from '../../src/lib/prisma/index.js'
import { redisClient } from '../../src/lib/redis/index.js'

vi.mock('../../src/lib/prisma/index.js', () => ({
    prisma: {
        wallet: {
            findMany: vi.fn(),
        },
    },
}))

vi.mock('../../src/lib/redis/index.js', () => ({
    redisClient: {
        get: vi.fn(),
        set: vi.fn(),
        exists: vi.fn(),
        connect: vi.fn(),
        on: vi.fn(),
    },
}))

describe('GET /wallet', () => {
    const mockUserId = 'user-123'

    const cachedWallets = [
        {
            id: 'wallet-123',
            name: 'Carteira Principal',
            userId: mockUserId,
            type: 'MAIN',
            category: 'teste',
            currency: 'BRL',
            amountCents: 0,
            createdAt: '2026-01-01T00:00:00.000Z',
        },
    ]

    let token: string

    beforeEach(async () => {
        vi.clearAllMocks()
        token = await generateAccessToken(mockUserId, 'user')
    })

    it('should return 400 when authorization header is missing', async () => {
        const response = await request(app).get('/wallet')

        expect(response.status).toBe(400)
        expect(response.body.error).toBe('VALIDATION_ERROR')
    })

    it('should return wallets and balance when request is authorized', async () => {
        vi.mocked(redisClient.get).mockImplementation(async (key) => {
            if (key === `user:wallets:${mockUserId}`) {
                return JSON.stringify(cachedWallets)
            }

            if (key === `user:balance:${mockUserId}`) {
                return '1500'
            }

            return null
        })

        const response = await request(app)
            .get('/wallet')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(prisma.wallet.findMany).not.toHaveBeenCalled()
        expect(response.body).toEqual({
            wallets: [
                {
                    ...cachedWallets[0],
                    amountCents: '0',
                },
            ],
            balance: '1500',
        })
    })
})
