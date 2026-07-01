import { AppError, CustomErrorContent } from './appError';
import { httpStatusCodes } from '../constants/statusCode';

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
