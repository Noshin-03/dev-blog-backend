import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { UnauthorizedError } from '../common/errorsClass';
import { Messages } from '../constants/messages';

export const requireAdmin = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    if (req.user?.role !== Role.ADMIN) {
        throw new UnauthorizedError(Messages.ADMIN_ONLY);
    }
    next();
};

export const requireOwnerOrAdmin =
    (userIdParam: string) =>
    (req: Request, _res: Response, next: NextFunction) => {
        const resourceOwnerId = req.params[userIdParam];
        const requestingUserId = req.user?.userId;
        const isAdmin = req.user?.role === Role.ADMIN;

        if (!isAdmin && requestingUserId !== resourceOwnerId) {
            throw new UnauthorizedError(Messages.UNAUTHORIZED);
        }
        next();
    };
