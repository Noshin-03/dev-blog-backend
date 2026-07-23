import { Prisma, PrismaClient, User } from '@prisma/client';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/userDTO';
import { UserQueryParams } from '../schemas/querySchema';

const getUserWhere = (params: UserQueryParams): Prisma.UserWhereInput => {
    const { username, email } = params;
    return {
        ...(username && {
            username: { contains: username, mode: 'insensitive' },
        }),
        ...(email && {
            email: { contains: email, mode: 'insensitive' },
        }),
        isDeleted: false,
    };
};

export class UserRepository {
    constructor(private prisma: PrismaClient) {}

    async create(user: CreateUserDTO): Promise<User> {
        return this.prisma.user.create({ data: user });
    }

    async getAllUser(params: UserQueryParams): Promise<User[]> {
        const { page, itemsPerPage, orderBy } = params;
        const where = getUserWhere(params);
        return this.prisma.user.findMany({
            where,
            orderBy: { [orderBy ?? 'joinDate']: 'desc' },
            take: itemsPerPage,
            skip: (page - 1) * itemsPerPage,
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
