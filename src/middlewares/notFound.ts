import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../common/errorsClass';

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};
