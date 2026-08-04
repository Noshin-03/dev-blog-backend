import { PrismaClient, Category } from '@prisma/client';

const categoryNames = [
    'Technology',
    'Lifestyle',
    'Business',
    'Education',
    'Entertainment',
    'Health',
    'Travel',
    'Science',
    'Finance',
];

export async function seedCategories(prisma: PrismaClient) {
    const categories = await Promise.all(
        categoryNames.map((name) =>
            prisma.category.upsert({
                where: { name },
                update: {},
                create: { name },
            }),
        ),
    );
    console.log(`Created ${categories.length} categories`);

    return categories;
}

export type SeededCategories = Category[];
