import { AppError, CustomErrorContent } from './appError';
import { httpStatusCodes } from '../constants/statusCode';

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
