export class AppError {
    public readonly message: string;
    public readonly error: string;
    public readonly statusCode: number;

    constructor({ message, error, statusCode=400 }: { message: string, error: string, statusCode: number }) {
        this.statusCode = statusCode
        this.message = message,
        this.error = error
    }
}