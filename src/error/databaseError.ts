import { AppError, CustomErrorContent } from './appError';
import { httpStatusCodes } from '../constants/statusCode';

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
