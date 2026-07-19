import request from 'supertest'
import { describe, expect, it, vi } from 'vitest';
import { app } from '../../src/server.js';
import { email } from 'zod';

vi.mock('../../controllers/auth/', () => ({
    loginUser: vi.fn().mockResolvedValue({
        user: {
            id: "user-1",
            email: "teste@teste.com",
            accessLevel: "user"
        },
        accessToken: "access-token",
        refreshToken: "refresh-token"
    })
}))

describe("POST /auth/login", async () => {
    it("Should authenticate and return the user data and accessToken", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "test@teste.com",
                password: "123456"
            })
            .expect(200)

        expect(response.body).toEqual({
            user: {
                id: "user-1",
                email: "teste@teste.com",
                accessLevel: "user"
            },
            accessToken: "access-token",
        })

        expect(response.headers['set-cookie']).toBeDefined()
    })
})