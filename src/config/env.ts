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
    //FIXME: need to change name
    PASSWORD: required('PASSWORD'),
    CLIENT_URL: required('CLIENT_URL'),
    EMAIL_JWT_SECRET: required('EMAIL_JWT_SECRET'),

    GEMINI_API_KEY: required('GEMINI_API_KEY'),
    SUMMARY_MAX_INPUT_CHARS: Number(
        process.env.SUMMARY_MAX_INPUT_CHARS ?? 5000,
    ),
} as const;
