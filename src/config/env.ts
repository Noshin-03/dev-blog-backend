import 'dotenv/config';
import type { StringValue } from 'ms';

const required = (key: string): string => {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
};

export const env = {
    PORT: Number(process.env.PORT ?? 5000),
    NODE_ENV: process.env.NODE_ENV ?? 'development',

    DATABASE_URL: required('DATABASE_URL'),

    JWT_SECRET: required('JWT_SECRET'),
    JWT_EXPIRATION: required('JWT_EXPIRATION') as StringValue,

    GMAIL: required('GMAIL'),
    MAIL_PASSWORD: required('MAIL_PASSWORD'),
    CLIENT_URL: required('CLIENT_URL'),
    EMAIL_JWT_SECRET: required('EMAIL_JWT_SECRET'),
    PASSWORD_JWT_EXPIRATION: required('PASSWORD_JWT_EXPIRATION') as StringValue,

    GEMINI_API_KEY: required('GEMINI_API_KEY'),
    SUMMARY_MAX_INPUT_CHARS: Number(
        process.env.SUMMARY_MAX_INPUT_CHARS ?? 5000,
    ),
    MAILJET_API_KEY: required('MAILJET_API_KEY'),
    MAILJET_SECRET_KEY: required('MAILJET_SECRET_KEY'),
} as const;
