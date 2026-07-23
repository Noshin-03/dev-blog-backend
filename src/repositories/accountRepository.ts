import { PrismaClient, User, Auth } from '@prisma/client';

type UserWithAuth = User & { auth: Auth };

export class AccountRepository {
    constructor(private prisma: PrismaClient) {}

    async createUserWithAuth(data: {
        username: string;
        name: string;
        email: string;
        passwordHash: string;
    }): Promise<UserWithAuth> {
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    username: data.username,
                    name: data.name,
                    email: data.email,
                },
            });

            const auth = await tx.auth.create({
                data: {
                    userId: user.id,
                    password: data.passwordHash,
                    passwordLastModificationTime: new Date(),
                },
            });

            return { ...user, auth };
        });
    }

    async softDeleteUserWithAuth(userId: string): Promise<User> {
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id: userId },
                data: { isDeleted: true },
            });

            await tx.auth.update({
                where: { userId },
                data: { passwordLastModificationTime: new Date() },
            });

            return user;
        });
    }
}
