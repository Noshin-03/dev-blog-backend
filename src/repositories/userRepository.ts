import { PrismaClient, User } from '@prisma/client';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/userDTO';

export class UserRepository {
    constructor(private prisma: PrismaClient) {}

    async create(user: CreateUserDTO): Promise<User> {
        return this.prisma.user.create({ data: user });
    }

    async getAllUser(): Promise<User[]> {
        return this.prisma.user.findMany({
            where: { isDeleted: false },
            orderBy: { joinDate: 'desc' },
        });
    }

    async getUserById(id: string): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: { id, isDeleted: false },
        });
    }

    async checkByUsername(username: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { username },
            select: { id: true },
        });
        return user !== null;
    }

    async checkByEmail(email: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });
        return user !== null;
    }

    async checkById(id: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { id: true },
        });
        return user !== null;
    }

    async update(id: string, user: UpdateUserDTO): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: user,
        });
    }

    async softDelete(id: string): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}
