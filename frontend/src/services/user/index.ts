import { api } from "#/utils/axios.ts";
import { getAccessToken } from "../auth";

export function getUserWallets(userId: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const accessToken = getAccessToken()
            const res = await api.get('/user/wallets', {
                headers: {
                    Authorization: `Baerer `
                }   
            })
        } catch (error) {
            reject(error)
        }
    })
}

