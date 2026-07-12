
import type { LoginSchemaType, RegisterSchemaType } from "#/schemas/user/index.ts";
import { api } from "#/utils/axios";

export async function loginUser({ email, password }: LoginSchemaType) {
    return new Promise<boolean>((resolve, reject) => {
        api.post<void>("/auth/login", { email, password })
        .then(() => {
            resolve(true)
        })
        .catch((err) => reject(err))
    })
}

export async function registerUser({ name, email, password }: RegisterSchemaType) {
    return new Promise<boolean>((resolve, reject) => {
        api.post<void>("/auth/register", { name, email, password })
        .then(() => {
            resolve(true)
        })
        .catch((err) => reject(err))
    })
}
