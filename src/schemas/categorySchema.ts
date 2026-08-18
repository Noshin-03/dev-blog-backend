import { z } from 'zod';
import { idSchema } from './idSchema';
import { CategoryValidation } from '../constants/schemaConstants';

export const categoryIdParamSchema = z.object({
    params: z.object({
        categoryId: idSchema,
    }),
});

export const createCategorySchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, 'Name is required')
            .max(
                CategoryValidation.MAX,
                `Name must be at most ${CategoryValidation.MAX} characters`,
            ),
        description: z
            .string()
            .max(CategoryValidation.MAX)
            .nullable()
            .optional()
            .transform((val) => val ?? undefined),
    }),
});

export const updateCategorySchema = z.object({
    body: createCategorySchema.shape.body
        .partial()
        .refine((data) => Object.keys(data).length > 0, {
            message: 'At least one field must be provided to update',
        }),
    params: categoryIdParamSchema.shape.params,
});
