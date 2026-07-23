import { env } from '../config/env';
import ms from 'ms';

const COOKIE_MAX_AGE_MS = ms(env.JWT_EXPIRATION);

export const setAuthCookie = (
    res: import('express').Response,
    token: string,
) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: COOKIE_MAX_AGE_MS,
    });
};
