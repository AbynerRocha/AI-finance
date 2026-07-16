import React, { createContext, useContext, useEffect, useState } from "react";
import { deleteAccessToken, getAccessToken, loginUser, LogoutUser, saveAccessToken } from "../services/auth";
import type { UserData } from "../schemas/user";
import { api } from "#/utils/axios.ts";
import Cookies from "js-cookie";

export type AuthContextData = {
    isAuthenticated: boolean
    accessToken: string | null
    user: UserData | null
    login: ({ email, password }: { email: string, password: string }) => Promise<boolean>
    requestNewAccessToken: () => Promise<string>
    logout: () => void
}

const AuthContext = createContext<AuthContextData | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [user, setUser] = useState<UserData | null>(null)

    useEffect(() => {
        const savedAccessToken = getAccessToken()

        if(savedAccessToken) {
            setAccessToken(savedAccessToken)
            setIsAuthenticated(true)
            return
        }

        if(!savedAccessToken) {
            requestNewAccessToken()
            return
        }
    }, [])

    const login = async ({ email, password }: { email: string, password: string }) => {
        try {
            const { user, accessToken } = await loginUser({ email, password })

            setUser(user)
            setAccessToken(accessToken)
            saveAccessToken(accessToken)
            setIsAuthenticated(true)

            return true
        } catch (error) {
            throw error
        }
    }

    const requestNewAccessToken = async () => {
        try {
            const res = await api.post<{ accessToken: string }>('/auth/refresh', {}, { withCredentials: true })

            const { accessToken } = res.data

            setAccessToken(accessToken)
            saveAccessToken(accessToken)
            return accessToken
        } catch(error) {
            throw error
        }
    }

    const logout = () => {
        try {
            LogoutUser()
            setUser(null)
            setAccessToken(null)
            deleteAccessToken()
            setIsAuthenticated(false)
        } catch (error) {
            throw error
        }
    }

    return <AuthContext.Provider
        value={{ 
            accessToken, 
            isAuthenticated, 
            login, 
            logout,
            requestNewAccessToken,
            user 
        }}
    >
        {children}
    </AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    return context
}