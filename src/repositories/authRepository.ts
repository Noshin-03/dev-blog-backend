import { PrismaClient } from '@prisma/client/extension';

export class AuthRepository {
    constructor(private prisma: PrismaClient) {}

    async createUserWithAuth(data: {
        username: string;
        name: string;
        email: string;
        passwordHash: string;
    }) {
        return this.prisma.user.create({
            data: {
                username: data.username,
                name: data.name,
                email: data.email,
                auth: {
                    create: {
                        password: data.passwordHash,
                        passwordLastModificationTime: new Date(),
                    },
                },
            },
            include: { auth: true },
        });
    }

    async changePassword(userId: string, hashedPassword: string) {
        return this.prisma.auth.update({
            where: { userId },
            data: {
                password: hashedPassword,
                passwordLastModificationTime: new Date(),
            },
        });
    }

    async checkAuthByUserId(userId: string) {
        return this.prisma.auth.findUnique({ where: { userId } });
    }

    async markEmailVerified(userId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { isVerified: true },
        });
    }
}
