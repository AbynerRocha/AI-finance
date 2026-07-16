
import type { LoginSchemaType, RegisterSchemaType, UserData } from "#/schemas/user/index.ts";
import { api } from "#/utils/axios";

const accessTokenKey = 'finance_access_token' 

type LoginResponse = {
    user: UserData,
    accessToken: string
}

type RegiterResponse = {
    user: UserData,
    accessToken: string
}

export async function loginUser({ email, password }: LoginSchemaType) {
    return new Promise<LoginResponse>((resolve, reject) => {
        api.post<LoginResponse>("/auth/login", { email, password })
        .then((res) => {
            resolve(res.data)
        })
        .catch((err) => reject(err))
    })
}

export async function registerUser({ name, email, password }: RegisterSchemaType) {
    return new Promise<RegiterResponse>((resolve, reject) => {
        api.post<RegiterResponse>("/auth/register", { name, email, password })
        .then((res) => {
            resolve(res.data)
        })
        .catch((err) => reject(err))
    })
}

export async function LogoutUser() {
    return new Promise<void>((resolve, reject) => {
        api.post("/auth/logout")
        .then(() => {
            resolve()
        })
        .catch((err) => reject(err))
    })
}

export function getAccessToken() {
    const data = localStorage.getItem(accessTokenKey)
    return data 
}

export async function saveAccessToken(token: string) {
    try {
        localStorage.setItem(accessTokenKey, token)
    } catch (error) {
        throw error
    }
}

export async function deleteAccessToken() {
    localStorage.removeItem(accessTokenKey)
}

export async function getNewAccesToken() {
    try { 
        const res = await api.post<{ accessToken: string }>("/auth/refresh", {}, { withCredentials: true })
        const { accessToken } = res.data

        if(accessToken) {
            saveAccessToken(accessToken)
        }

        return accessToken
    }catch (error) {
        throw error
    }
}   