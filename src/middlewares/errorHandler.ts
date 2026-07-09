import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import {
    AppError,
    ValidationError,
    DatabaseError,
} from '../common/errorsClass';
import { logger } from '../utils/logger';
import { httpStatusCodes } from '../constants/statusCode';
import { sendError } from '../utils/response';

const isDev = process.env.NODE_ENV === 'development';

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    if (err instanceof AppError) {
        if (err.logging) {
            logger.error(err.message, {
                statusCode: err.statusCode,
                errors: err.errors,
                stack: err.stack,
            });
        }

        sendError(
            res,
            err.statusCode,
            err.errors,
            isDev ? err.stack : undefined,
        );
        return;
    }

    if (err instanceof ZodError) {
        const validationError = new ValidationError(
            'Validation failed',
            err.issues.map((issue) => ({
                message: issue.message,
                context: { path: issue.path.join('.'), code: issue.code },
            })),
        );

        logger.warn('Zod validation error', { errors: validationError.errors });

        sendError(
            res,
            validationError.statusCode,
            validationError.errors,
            isDev ? err.stack : undefined,
        );
        return;
    }

    if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            const fields =
                (err.meta?.target as string[])?.join(', ') ?? 'field';
            const conflictError = new DatabaseError(
                `Unique constraint failed on: ${fields}`,
            );

            logger.error('Prisma unique constraint violation', {
                code: err.code,
                meta: err.meta,
                stack: err.stack,
            });

            sendError(
                res,
                httpStatusCodes.CONFLICT,
                conflictError.errors,
                isDev ? err.stack : undefined,
            );
            return;
        }

        if (err.code === 'P2025') {
            sendError(
                res,
                httpStatusCodes.NOT_FOUND,
                [{ message: 'Record not found' }],
                isDev ? err.stack : undefined,
            );
            return;
        }

        const dbError = new DatabaseError('Database operation failed');
        logger.error('Prisma known error', {
            code: err.code,
            meta: err.meta,
            stack: err.stack,
        });

        sendError(
            res,
            dbError.statusCode,
            dbError.errors,
            isDev ? err.stack : undefined,
        );
        return;
    }

    if (err instanceof PrismaClientValidationError) {
        const dbError = new DatabaseError('Invalid database query');
        logger.error('Prisma validation error', { stack: err.stack });

        sendError(
            res,
            dbError.statusCode,
            dbError.errors,
            isDev ? err.stack : undefined,
        );
        return;
    }

    logger.error('Unexpected error', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
    });

    sendError(
        res,
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        [{ message: 'Internal Server Error' }],
        isDev && err instanceof Error ? err.stack : undefined,
    );
};
