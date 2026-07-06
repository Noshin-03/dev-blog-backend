import { AppError, CustomErrorContent } from './appError';
import { httpStatusCodes } from '../constants/statusCode';

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
