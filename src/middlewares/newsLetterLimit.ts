import { Request, Response, NextFunction } from 'express';
import { consumeToken } from '../utils/rateLimiter';
import { ValidationError } from '../common/errorsClass';
import { Messages } from '../constants/messages';

const MAX_TOKENS = 5;
const REFILL_INTERVAL = 60 * 1000;

export const newsletterRateLimit = (
    req: Request,
    _res: Response,
    next: NextFunction,
): void => {
    const key = `newsletter-subscribe:${req.ip}`;

    const allowed = consumeToken(key, MAX_TOKENS, REFILL_INTERVAL);

    if (!allowed) {
        throw new ValidationError(Messages.TOO_MANY_REQUESTS);
    }

    next();
};
