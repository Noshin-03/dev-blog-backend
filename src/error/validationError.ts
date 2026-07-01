import { AppError, CustomErrorContent } from './appError';
import { httpStatusCodes } from '../constants/statusCode';

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
