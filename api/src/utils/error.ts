type AppErrorType = {
    message: string,
    name: string,
    statusCode: number,
    issues?: {
        target?: string
        message?: string
    }[]
    redirect?: string
}

export class AppError {
    public readonly name: string;
    public readonly message: string;
    public readonly redirect?: string;
    public readonly statusCode: number;
    public readonly issues?: {
        target?: string
        message?: string
    }[];

    constructor({ message, name, statusCode, issues, redirect }: AppErrorType) {
        this.statusCode = statusCode
        this.message = message
        this.name = name

        if(issues) this.issues = issues 
        if(redirect) this.redirect = redirect 
    }
}

export class UserError extends AppError {
    constructor(props: AppErrorType) {
        super(props)
    }

    static userNotFound() {
        return new UserError({
            message: "Utilizador inexistente",
            name: "USER_NOT_FOUND",
            statusCode: 404
        })
    }

    static userExists() {
        return new UserError({
            message: "Este utilizador já existe",
            name: "USER_ALREADY_EXISTS",
            statusCode: 409
        })
    }

    static walletNotFound() {
    
    }
}

export class AuthError extends AppError {
    constructor(props: AppErrorType) {
        super(props)
    }

    static invalidCredentials() {
        return new AuthError({
            statusCode: 401,
            message: "Utilizador ou senha inválida.",
            name: "INVALID_CREDENTIALS",
            issues: [
                { 
                    target: 'email',
                },
                {
                    target: "password"
                }
            ]
        })
    }
    
    static notAuthorized() {
        return new AuthError({
            statusCode: 401,
            message: "Você não está autorizado para esta ação.",
            name: "NOT_AUTHORIZED"
        })
    }

    static invalidToken() {
        return new AuthError({
            statusCode: 401,
            message: "Não autorizado.",
            name: "INVALID_TOKEN"
        })
    }

    static expiredRefreshToken() {
        return new AuthError({
            message: "Sessão expirada.",
            name: "REFRESH_TOKEN_EXPIRED",
            statusCode: 401,
            redirect: "/login"
        })
    }
}

export class WalletError extends AppError {
    constructor(props: AppErrorType) {
      super(props)
    }

    static walletNotFound() {
        return new WalletError({
            name: "WALLET_NOT_FOUND",
            message: "Não foi possível encontrar esta carteira",
            statusCode: 404
        })
    }

    static insufficientsFunds() {
        return new WalletError({
            name: "INSUFFICIENTS_FUNDS",
            message: "Saldo insuficiente para esta operação.",
            statusCode: 409
        })
    }
}
