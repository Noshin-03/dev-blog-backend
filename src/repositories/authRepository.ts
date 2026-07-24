import { PrismaClient } from '@prisma/client';

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
        return this.prisma.auth.findUnique({
            where: { userId },
            include: {
                user: true,
            },
        });
    }

    async checkByToken(token: string) {
        return this.prisma.auth.findFirst({
            where: {
                changePasswordToken: token,
                isValid: true,
            },
        });
    }

    async savePasswordChangeToken(userId: string, token: string) {
        return this.prisma.auth.update({
            where: { userId },
            data: {
                changePasswordToken: token,
                isValid: true,
            },
        });
    }

    async invalidatePasswordChangeToken(userId: string) {
        return this.prisma.auth.update({
            where: {
                userId,
            },
            data: {
                isValid: false,
            },
        });
    }

    async markEmailVerified(userId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { isVerified: true },
        });
    }
}
