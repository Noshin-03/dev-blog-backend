import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
    console.log('Seeding admin user...');

    const password = await bcrypt.hash('Password123', SALT_ROUNDS);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@devblog.com' },
        update: {},
        create: {
            username: 'admin',
            name: 'Admin User',
            email: 'admin@devblog.com',
            role: Role.ADMIN,
            auth: {
                create: { password },
            },
        },
    });

    console.log(`Admin created: ${admin.email}`);
    console.log(`Usrename: ${admin.username}`);
}

main()
    .catch((e) => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
