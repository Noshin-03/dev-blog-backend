import { httpStatusCodes } from '../constants/statusCode';
import { AppError, CustomErrorContent } from './appError';

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
