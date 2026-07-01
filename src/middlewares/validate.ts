import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';

export const validate =
    (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
            });
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                const formatErrors = err.issues.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));

                res.status(400).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors: formatErrors,
                });
                return;
            }
            next(err);
        }
    };
