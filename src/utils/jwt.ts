import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env';

export interface JwtPayload {
    userId: string;
    username: string;
    email: string;
    role: Role;
}

export interface PasswordChangeTokenPayload {
    userId: string;
    purpose: 'password-change';
}

export interface EmailTokenPayload {
    userId: string;
    purpose: 'email-verification';
}

export const signToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRATION,
    });
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};

export const signEmailToken = (userId: string): string => {
    return jwt.sign(
        { userId, purpose: 'email-verification' },
        env.EMAIL_JWT_SECRET,
        { expiresIn: env.JWT_EXPIRATION },
    );
};

export const verifyEmailToken = (token: string): EmailTokenPayload => {
    return jwt.verify(token, env.EMAIL_JWT_SECRET) as EmailTokenPayload;
};
//FIXME: set the expiration time in .env
export const signPasswordChangeToken = (userId: string): string => {
    return jwt.sign(
        {
            userId,
            purpose: 'password-change',
        },
        env.JWT_SECRET,
        {
            expiresIn: env.JWT_EXPIRATION,
        },
    );
};

export const verifyPasswordChangeToken = (
    token: string,
): PasswordChangeTokenPayload => {
    return jwt.verify(token, env.JWT_SECRET) as PasswordChangeTokenPayload;
};
