import { Response } from 'express';
import { httpStatusCodes } from '../constants/statusCode';
import { CustomErrorContent } from '../common/errorsClass';

export const sendResponse = <T>(
    res: Response,
    statusCode: httpStatusCodes | number,
    data?: T,
    message?: string,
) => {
    const responseBody: { status: 'success'; data?: T; message?: string } = {
        status: 'success',
    };

    if (data !== undefined) {
        responseBody.data = data;
    }

    if (message) {
        responseBody.message = message;
    }

    return res.status(statusCode).json(responseBody);
};

export const sendError = (
    res: Response,
    statusCode: httpStatusCodes | number,
    errors: CustomErrorContent[],
    stack?: string,
) => {
    return res.status(statusCode).json({
        status: 'error',
        errors,
        ...(stack && { stack }),
    });
};
