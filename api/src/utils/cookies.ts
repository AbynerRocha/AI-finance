import { REFRESH_TOKEN_DURATION } from "../controllers/auth/token/index.js";

const prefix = 'finance_'

export const cookieRefreshToken = {
    name: prefix + 'refresh_token',
    options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: REFRESH_TOKEN_DURATION
    }
}
