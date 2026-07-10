
const prefix = 'finance_'

export const cookieAuthToken = {
    name: prefix + 'token',
    options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 7d
    }
}
