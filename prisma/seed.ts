import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
    console.log('Seeding database...');

    await prisma.storyCategory.deleteMany();
    await prisma.story.deleteMany();
    await prisma.auth.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();

    const password = await bcrypt.hash('Password123', SALT_ROUNDS);

    const admin = await prisma.user.create({
        data: {
            username: 'admin',
            name: 'Admin User',
            email: 'admin@devblog.com',
            role: Role.ADMIN,
            isVerified: true,
            auth: { create: { password } },
        },
    });
    console.log(`Admin created: ${admin.email}`);

    const userSeeds = [
        {
            username: 'tabassum',
            name: 'Noshin Tabassum Dina',
            email: 'tabassum@devblog.com',
        },
        {
            username: 'rafiq',
            name: 'Rafiq Islam',
            email: 'rafiq@devblog.com',
        },
        {
            username: 'sara',
            name: 'Sara Ahmed',
            email: 'sara@devblog.com',
        },
        {
            username: 'kabir',
            name: 'Kabir Hossain',
            email: 'kabir@devblog.com',
        },
    ];

    const users = await Promise.all(
        userSeeds.map((u) =>
            prisma.user.create({
                data: {
                    username: u.username,
                    name: u.name,
                    email: u.email,
                    role: Role.USER,
                    isVerified: true,
                    auth: { create: { password } },
                },
            }),
        ),
    );
    console.log(`Created ${users.length} regular users`);

    const categoryNames = [
        'Technology',
        'Lifestyle',
        'Business',
        'Education',
        'Entertainment',
        'Health',
        'Travel',
    ];

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

    const findCategory = (name: string) => {
        const category = categories.find((c) => c.name === name);
        if (!category)
            throw new Error(`Category "${name}" not found in seed data`);
        return category;
    };

    const [tabassum, rafiq, sara, kabir] = users;

    const storySeeds = [
        {
            author: admin,
            title: 'Welcome to DevBlog',
            body: 'Welcome to DevBlog — a platform for developers to share knowledge, experiences, and ideas. We are excited to have you here.',
            categoryNames: ['Technology', 'Education'],
        },
        {
            author: tabassum,
            title: 'How CRISPR Is Transforming Modern Medicine',
            body: 'CRISPR gene-editing technology has revolutionized biomedical research by allowing scientists to modify DNA with unprecedented precision. Researchers are exploring its potential to treat inherited genetic disorders, develop more effective cancer therapies, and combat infectious diseases. While the technology offers tremendous promise, ethical concerns surrounding human genome editing and long-term safety remain active areas of discussion.',
            categoryNames: ['Technology', 'Health'],
        },
        {
            author: rafiq,
            title: 'Building a Freelance Business as a Developer',
            body: 'Freelancing as a developer offers flexibility but comes with its own challenges — finding clients, pricing your work, and managing your time. This post covers practical strategies for setting up contracts, handling invoicing, and building a steady pipeline of repeat clients.',
            categoryNames: ['Business', 'Technology'],
        },
        {
            author: sara,
            title: '5 Habits for a Healthier Work-Life Balance',
            body: 'Long hours at a desk can take a toll on both body and mind. Simple habits like scheduled breaks, regular exercise, and setting boundaries around work communication can make a significant difference in long-term wellbeing and productivity.',
            categoryNames: ['Lifestyle', 'Health'],
        },
        {
            author: kabir,
            title: 'Top Budget Travel Destinations for Remote Workers',
            body: 'Remote work has opened the door to working from anywhere. This post rounds up affordable destinations with reliable internet, welcoming visa policies, and a strong community of digital nomads to help you plan your next work-cation.',
            categoryNames: ['Travel', 'Lifestyle'],
        },
        {
            author: rafiq,
            title: 'A Beginner’s Guide to System Design Interviews',
            body: 'System design interviews can feel intimidating, especially for early-career developers. This guide breaks down the core concepts — scalability, load balancing, caching, and database design — with a simple framework to approach any design question with confidence.',
            categoryNames: ['Technology', 'Education'],
        },
        {
            author: sara,
            title: 'The Rise of Interactive Streaming Content',
            body: 'Interactive streaming is changing how audiences engage with entertainment, letting viewers influence story outcomes and participate in real time. This post looks at the platforms leading this shift and what it means for the future of content creation.',
            categoryNames: ['Entertainment'],
        },
    ];

    for (const s of storySeeds) {
        const story = await prisma.story.create({
            data: {
                userId: s.author.id,
                title: s.title,
                body: s.body,
                categories: {
                    create: s.categoryNames.map((name) => ({
                        categoryId: findCategory(name).id,
                    })),
                },
            },
        });
        console.log(
            `Created story: "${story.title}" (by ${s.author.username})`,
        );
    }

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
