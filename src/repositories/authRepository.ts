import { PrismaClient } from '@prisma/client/extension';

export class AuthRepository {
    constructor(private prisma: PrismaClient) {}

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
}
