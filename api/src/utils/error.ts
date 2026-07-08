type AppErrorType = {
    message: string,
    error: string,
    statusCode: number,
    issues?: {
        target?: string
        message?: string
    }[]
}

export class AppError {
    public readonly message: string;
    public readonly error: string;
    public readonly statusCode: number;
    public readonly issues?: {
        target?: string
        message?: string
    }[];

    constructor({ message, error, statusCode, issues }: AppErrorType) {
        this.statusCode = statusCode
        this.message = message
        this.error = error

        if(issues) this.issues = issues 
    }
}

export class UserError extends AppError {
    constructor(params: AppErrorType) {
        super(params)
    }

    static userNotFound() {
        return new UserError({
            message: "Utilizador inexistente",
            error: "USER_NOT_FOUND",
            statusCode: 404
        })
    }

    static userExists() {
        return new UserError({
            message: "Este utilizador já existe",
            error: "USER_ALREADY_EXISTS",
            statusCode: 409
        })
    }
}

export class AuthError extends AppError {
    constructor(params: AppErrorType) {
        super(params)
    }

    static failedAuth() {
        return new AppError({
            statusCode: 403,
            message: "Utilizador ou senha inválida.",
            error: "AUTH_FAILED",
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

    // Admin

    static invalidToken() {
        return new AppError({
            statusCode: 403,
            message: "Não autorizado.",
            error: "ACCESS_FORBIDDEN"
        })
    }
}
