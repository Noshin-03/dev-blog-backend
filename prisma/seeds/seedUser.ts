import { PrismaClient, Role, User } from '@prisma/client';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

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
    {
        username: 'ayesha',
        name: 'Ayesha Rahman',
        email: 'ayesha@devblog.com',
    },
    {
        username: 'nabil',
        name: 'Nabil Chowdhury',
        email: 'nabil@devblog.com',
    },
    {
        username: 'farhan',
        name: 'Farhan Kader',
        email: 'farhan@devblog.com',
    },
    {
        username: 'mitu',
        name: 'Mitu Akter',
        email: 'mitu@devblog.com',
    },
    {
        username: 'nusrat',
        name: 'Nusrat Jahan',
        email: 'nusrat@devblog.com',
    },
    {
        username: 'shuvo',
        name: 'Shuvo Rahman',
        email: 'shuvo@devblog.com',
    },
    {
        username: 'zayed',
        name: 'Zayed Karim',
        email: 'zayed@devblog.com',
    },
    {
        username: 'anika',
        name: 'Anika Islam',
        email: 'anika@devblog.com',
    },
    {
        username: 'sabbir',
        name: 'Sabbir Hasan',
        email: 'sabbir@devblog.com',
    },
];
export async function seedUsers(prisma: PrismaClient) {
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

    return { admin, users };
}

export type SeededUsers = {
    admin: User;
    users: User[];
};
