import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError, ForbiddenError } from '../common/errorsClass';
import { Messages } from '../constants/messages';
import { RBACUtils } from '../utils/rbacUtils';
import { getResourceAndAction } from '../utils/authorizationUtils';

export const authorize = (options?: {
    resource?: string;
    action?: string;
    getResourceOwnerId?: (req: Request) => Promise<string | undefined>;
}) => {
    return async (
        req: Request,
        _res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new UnauthorizedError(Messages.UNAUTHORIZED);
            }

            const { role, userId } = req.user;
            const { resource, action } = getResourceAndAction(
                req,
                options?.resource,
                options?.action,
            );

            let resourceOwnerId: string | undefined;
            if (options?.getResourceOwnerId) {
                resourceOwnerId = await options.getResourceOwnerId(req);
            }

            const hasPermission = RBACUtils.hasPermission(
                role,
                resource,
                action,
                userId,
                resourceOwnerId,
            );

            if (!hasPermission) {
                throw new ForbiddenError(Messages.FORBIDDEN);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
