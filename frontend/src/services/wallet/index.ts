import { getAllUserWalletsSchema, walletSchema, type WalletData } from "#/schemas/wallet/index.ts";
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

    try {
        const response = await api.get<{ balance: bigint, wallets: WalletData[] }>('/wallet', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }) 
        
        console.log(response.data)

        return getAllUserWalletsSchema.parse(response.data)
    } catch (error) {   
       throw error
    }
}

export async function getUserWallet(walletId: string) {
    const accessToken = getAccessToken()

    try {
        const response = await api.get<WalletData>(`/wallet/${walletId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }) 

        return walletSchema.parse(response.data)
    } catch (error) {   
       throw error
    }
}

export async function changeWalletBalance(walletId: string, amount: bigint) {
    
}
 