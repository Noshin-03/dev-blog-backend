export type CustomErrorContent = {
    message: string;
    context?: Record<string, unknown>;
};

export abstract class AppError extends Error {
    abstract readonly statusCode: number;
    abstract readonly errors: CustomErrorContent[];
    abstract readonly logging: boolean;
    public readonly isOperational: boolean;

    constructor(message: string, isOperational = true) {
        super(message);
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);

        Object.setPrototypeOf(this, new.target.prototype);
    }
}
