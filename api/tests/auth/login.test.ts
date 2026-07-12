import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UserError, AuthError } from '../../src/utils/error.js'
import { faker } from '@faker-js/faker'
import { loginUser } from '../../src/controllers/auth/index.js'
const mocks = vi.hoisted(() => ({
    getUser: vi.fn(),
    verifyUserPassword: vi.fn(),
    generateAccessToken: vi.fn()
}))

vi.mock("../../src/controllers/user/", () => ({
    getUser: mocks.getUser,
    verifyUserPassword: mocks.verifyUserPassword
}))

vi.mock("../../src/controllers/auth/token/", () => ({
    generateAccessToken: mocks.generateAccessToken
}))

describe('login user', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('Should make login successfully and return the user data and token', async () => {
        const mockUser = {
            id: "e63fd5ab-6576-4fe2-9ab4-c7e438f1f28d",
            email: "Test@test.com",
            accessLevel: 'user'
        }
        const password = "123456"
        const mockToken = 'jwt-valid-token'

        mocks.getUser.mockResolvedValue(mockUser)
        mocks.verifyUserPassword.mockResolvedValue(true)
        mocks.generateAccessToken.mockResolvedValue(mockToken)

        const result = await loginUser(mockUser.email, password)
        
        expect(mocks.getUser).toHaveBeenCalledWith({ email: mockUser.email })
        expect(mocks.verifyUserPassword).toHaveBeenCalledWith(password, mockUser.email)
        expect(mocks.generateAccessToken).toHaveBeenCalledWith(mockUser.id, mockUser.accessLevel)
        expect(result).toEqual({ user: mockUser, accessToken: mockToken })
    })    

    it("Should throw UserError.userNotFound() if user does not exist", async () => {
        const email = faker.internet.email()
        const password = faker.internet.password()

        mocks.getUser.mockResolvedValue(null)
        mocks.verifyUserPassword.mockResolvedValue(false)

        await expect(loginUser(email, password)).rejects.toThrow(UserError.userNotFound())
        expect(mocks.getUser).toHaveBeenCalledWith({ email })
        expect(mocks.verifyUserPassword).not.toHaveBeenCalled()
        expect(mocks.generateAccessToken).not.toHaveBeenCalled()
    })

    it("Should throw AuthError.invalidCredentials() if user exists but credentials are invalid", async () => {
        const email = "test@test.com"
        const password = faker.internet.password()

        mocks.getUser.mockResolvedValue({ email })
        mocks.verifyUserPassword.mockResolvedValue(false)

        await expect(loginUser(email, password)).rejects.toThrow(AuthError.invalidCredentials())
        expect(mocks.getUser).toHaveBeenCalledWith({ email })
        expect(mocks.verifyUserPassword).toHaveBeenCalledWith(password, email)
        expect(mocks.generateAccessToken).not.toHaveBeenCalled()
    })
})


