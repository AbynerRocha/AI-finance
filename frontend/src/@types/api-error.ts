
export type ApiError = {
    error: string,
    message: string, 
    issues?: {
        target: string,
        message: string
    }[]
}
