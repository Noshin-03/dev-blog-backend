import { z } from 'zod';
import { StoryValidation } from '../constants/schemaConstants';
import { idSchema } from './idSchema';

export const storyIdParamSchema = z.object({
    params: z.object({
        storyId: idSchema,
    }),
});

export const createStorySchema = z.object({
    body: z.object({
        userId: idSchema,
        title: z
            .string()
            .min(
                StoryValidation.MIN,
                `Title must be at least ${StoryValidation.MIN} characters`,
            )
            .max(
                StoryValidation.MAX,
                `Title must be at most ${StoryValidation.MAX} characters`,
            ),
        body: z
            .string()
            .min(
                StoryValidation.BODY,
                `Body must be at least ${StoryValidation.BODY} characters`,
            ),
        categoryIds: z.array(idSchema).optional(),
    }),
});

export const updateStorySchema = z.object({
    params: storyIdParamSchema.shape.params,
    body: createStorySchema.shape.body
        .omit({ userId: true })
        .partial()
        .refine((data) => Object.keys(data).length > 0, {
            message: 'At least one field must be provided to update',
        }),
});
