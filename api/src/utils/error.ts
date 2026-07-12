type AppErrorType = {
    message: string,
    name: string,
    statusCode: number,
    issues?: {
        target?: string
        message?: string
    }[]
}

export class AppError {
    public readonly message: string;
    public readonly name: string;
    public readonly statusCode: number;
    public readonly issues?: {
        target?: string
        message?: string
    }[];

    constructor({ message, name, statusCode, issues }: AppErrorType) {
        this.statusCode = statusCode
        this.message = message
        this.name = name

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
}

export class AuthError extends AppError {
    constructor(params: AppErrorType) {
        super(params)
    }

    static invalidCredentials() {
        return new AuthError({
            statusCode: 403,
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

    // Admin
    
    static notAuthorized() {
        return new AuthError({
            statusCode: 403,
            message: "Você não está autorizado para esta ação.",
            name: "FORBIDDEN"
        })
    }

    static invalidToken() {
        return new AuthError({
            statusCode: 403,
            message: "Não autorizado.",
            name: "INVALID_TOKEN"
        })
    }
}
