import { Request, RequestHandler, NextFunction } from 'express';
import { z } from 'zod';

type ValidatedData = {
    body?: unknown;
    params?: unknown;
    query?: unknown;
};

export const validate =
    <T extends z.ZodType<ValidatedData>>(schema: T): RequestHandler =>
    (req: Request, _res, next: NextFunction) => {
        try {
            const result = schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
            });

            req.validated = result;

            if (result.body !== undefined) {
                req.body = result.body;
            }

            if (result.params !== undefined) {
                req.params = result.params as Request['params'];
            }

            next();
        } catch (err) {
            next(err);
        }
    };
