import { email, z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        username: z
            .string()
            .min(3, 'Username must be at least 3 characters')
            .max(30, 'Username must be at most 30 characters'),
        name: z.string().min(3, 'Name is required'),
        email: z.string().email(),
        role: z.enum(['ADMIN', 'USER']).optional(),
    }),
});

export const updateUserSchema = z.object({
    body: z
        .object({
            username: z.string().min(3).max(30).optional,
            name: z.string().min(3).optional(),
            email: z.string().email().optional(),
            role: z.enum(['ADMIN', 'USER']).optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: 'At least one field must be provided to update',
        }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
