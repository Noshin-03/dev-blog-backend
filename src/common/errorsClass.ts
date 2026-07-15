import { httpStatusCodes } from '../constants/statusCode';
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

export class ConflictError extends AppError {
    readonly statusCode = httpStatusCodes.CONFLICT;
    readonly logging = false;
    readonly errors: CustomErrorContent[];

    constructor(
        message = 'Resource already exists',
        errors?: CustomErrorContent[],
    ) {
        super(message);
        this.errors = errors ?? [{ message }];
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

export class DatabaseError extends AppError {
    readonly statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    readonly logging = true;
    readonly errors: CustomErrorContent[];
    readonly isOperational = false;

    constructor(message = 'A database error occurred') {
        super(message, false);
        this.errors = [{ message }];
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}

export class ForbiddenError extends AppError {
    readonly statusCode = httpStatusCodes.FORBIDDEN;
    readonly logging = false;
    readonly errors: CustomErrorContent[];

    constructor(message = 'Forbidden') {
        super(message);
        this.errors = [{ message }];
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

export class NotFoundError extends AppError {
    readonly statusCode = httpStatusCodes.NOT_FOUND;
    readonly logging = false;
    readonly errors: CustomErrorContent[];

    constructor(message = 'Resource not found') {
        super(message);
        this.errors = [{ message }];
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class UnauthorizedError extends AppError {
    readonly statusCode = httpStatusCodes.UNAUTHORIZED;
    readonly logging = false;
    readonly errors: CustomErrorContent[];

    constructor(message = 'Unauthorized') {
        super(message);
        this.errors = [{ message }];
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

export class ValidationError extends AppError {
    readonly statusCode = httpStatusCodes.BAD_REQUEST;
    readonly logging = false;
    readonly errors: CustomErrorContent[];

    constructor(message = 'Validation failed', errors?: CustomErrorContent[]) {
        super(message);
        this.errors = errors ?? [{ message }];
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export class AiError extends AppError {
    readonly statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    readonly logging = false;
    readonly errors: CustomErrorContent[];

    constructor(
        message = 'An AI error occurred',
        errors?: CustomErrorContent[],
    ) {
        super(message, false);
        this.errors = errors ?? [{ message }];
        Object.setPrototypeOf(this, AiError.prototype);
    }
}
