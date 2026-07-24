import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError } from '../common/errorsClass';
import { Messages } from '../constants/messages';

export const authenticate = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : undefined;
    const token = req.cookies?.token ?? headerToken;
    if (!token) {
        throw new UnauthorizedError(Messages.TOKEN_REQUIRED);
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch {
        throw new UnauthorizedError(Messages.TOKEN_INVALID);
    }
};
