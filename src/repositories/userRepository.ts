import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../interfaces/userInterface';
import { CreateUserDTO, UserResponseDTO } from '../dtos/userDTO';
import { PaginationParams } from '../schemas/querySchema';

export class UserRepository implements IUserRepository {
    constructor(private prisma: PrismaClient) {}

    async create(user: CreateUserDTO): Promise<UserResponseDTO> {
        return this.prisma.user.create({ 
            data: user 
        });
    }

    async findAll(paginationParams: PaginationParams): Promise<UserResponseDTO[]> {
        const { page, limit } = paginationParams;
        return this.prisma.user.findMany({
            where: { isDeleted: false },
            orderBy: { joinDate: 'desc' },
            take: limit,
            skip: (page - 1) * limit
        });
    }

    async findById(id: number): Promise<UserResponseDTO | null> {
        return this.prisma.user.findFirst({
            where: { id, isDeleted: false }
        });
    }

    async update(id: number, user: Partial<CreateUserDTO>): Promise<UserResponseDTO | null> {
        return this.prisma.user.update({ 
            where: { id }, 
            data: user 
        });
    }

    async softDelete(id: number): Promise<UserResponseDTO | null> {
        return this.prisma.user.update({ 
            where: { id },
            data: { isDeleted: true } 
        });
    }

    async getUserByEmail(email: string): Promise<UserResponseDTO | null> {
        return this.prisma.user.findUnique({ 
            where: { email } 
        });
    }

    async getUserByUsername(username: string): Promise<UserResponseDTO | null> {
        return this.prisma.user.findUnique({ 
            where: { username } 
        });
    }
}