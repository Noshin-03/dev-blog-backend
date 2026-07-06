import { AppError, CustomErrorContent } from './appError';
import { httpStatusCodes } from '../constants/statusCode';

export class ConflictError extends AppError {
    readonly statusCode = httpStatusCodes.CONFLICT;
    readonly logging = false;
    readonly errors: CustomErrorContent[];

    constructor(message = 'Resource already exists') {
        super(message);
        this.errors = [{ message }];
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}
