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

    async getUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { username } });
    }
}
