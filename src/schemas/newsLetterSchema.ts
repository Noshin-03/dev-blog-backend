import { z } from 'zod';

export const subscribeSchema = z.object({
    body: z.object({
        email: z.email({ message: 'A valid email is required' }),
    }),
});

export const newsletterTokenParamSchema = z.object({
    params: z.object({
        token: z.string().min(1, 'Token is required'),
    }),
});
