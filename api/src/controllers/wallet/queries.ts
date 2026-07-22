import type { WalletInclude } from "../../generated/prisma/models.js";

export const walletFullInclude = {
    Transactions: {
        include: {
            transactionsCategories: {
                select: {
                    name: true
                }
            }
        }
    },
    WalletCategories: {
        select: {
            name: true
        }
    }
} satisfies WalletInclude

export const walletQueryIncludeLastTransaction = {
    Transactions: {
        include: {
            transactionsCategories: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            date:"desc"
        },
        take: 1
    },
    WalletCategories: {
        select: {
            name: true
        }
    }
} satisfies WalletInclude