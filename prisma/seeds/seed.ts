import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seedUser';
import { seedCategories } from './seedCategory';
import { seedStories } from './seedStory';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    await prisma.storyCategory.deleteMany();
    await prisma.story.deleteMany();
    await prisma.auth.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();

    const { admin, users } = await seedUsers(prisma);
    const categories = await seedCategories(prisma);
    await seedStories(prisma, [admin, ...users], categories);

    console.log('\nCredentials (all use password: Password123):');
    console.log(`admin@devblog.com`);
    users.forEach((u) => console.log(`   👤 ${u.email}`));

    console.log('\nSeeding complete!');
}

main()
    .catch((e) => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
