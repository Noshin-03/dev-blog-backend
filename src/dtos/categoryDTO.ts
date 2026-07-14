import { Category } from '@prisma/client';
import { z } from 'zod';
import {
    createCategorySchema,
    updateCategorySchema,
} from '../schemas/categorySchema';

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>['body'];
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>['body'];

export class CategoryResponseDTO {
    public readonly id: string;
    public readonly name: string;
    public readonly description: string | null;
    public readonly createdAt: Date;

    constructor(category: Category) {
        this.id = category.id;
        this.name = category.name;
        this.description = category.description;
        this.createdAt = category.createdAt;
    }
}
