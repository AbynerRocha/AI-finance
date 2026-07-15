import type { WalletData } from "#/schemas/wallet/index.ts";
import { api } from "#/utils/axios.ts";
import { getAccessToken } from "../auth";

export async function createWallet({ accessToken, name }: { accessToken: string; name: string }) {
    try {
        const response = await api.post(`/wallet`, { name }, { 
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        return response.data
    } catch (error) {
        throw error
    }
}

export async function getUserWallets() {
    const accessToken = getAccessToken()

    console.log(accessToken)

    try {
        const response = await api.get<WalletData[]>('/wallet', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }) 

        return response.data
    } catch (error) {
        throw error   
    }
}
