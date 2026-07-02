import prisma from '../config/prisma';
import { UserRepository } from '../repositories/userRepository';
import { CreateUserDTO } from '../dtos/userDTO';
import { PaginationParams } from '../schemas/querySchema';
import { httpStatusCodes } from '../constants/statusCode';

const userRepository = new UserRepository(prisma);

export class UserService {
    async createUser(data: CreateUserDTO) {
        const [existingEmail, existingUsername] = await Promise.all([
            userRepository.getUserByEmail(data.email),
            userRepository.getUserByUsername(data.username),
        ]);

        if (existingEmail) {
            const error: any = new Error('Email already in use');
            error.statusCode = httpStatusCodes.CONFLICT;
            throw error;
        }

        if (existingUsername) {
            const error: any = new Error('Username already in use');
            error.statusCode = httpStatusCodes.CONFLICT;
            throw error;
        }

        return userRepository.create(data);
    }

    async getAllUsers(paginationParams: PaginationParams) {
        return userRepository.findAll(paginationParams);
    }

    async getUserById(id: number) {
        const user = await userRepository.findById(id);
        if (!user) {
            const error: any = new Error('User not found');
            error.statusCode = httpStatusCodes.NOT_FOUND;
            throw error;
        }
        return user;
    }

    async updateUser(id: number, data: Partial<CreateUserDTO>) {
        const existingUser = await userRepository.findById(id);

        if(!existingUser) {
            const error: any = new Error('User not found');
            error.statusCode = httpStatusCodes.NOT_FOUND;
            throw error;
        }

        return userRepository.update(id, data);
    }

    async softDeleteUser(id: number) {
        const existingUser = await userRepository.findById(id);

        if(!existingUser) {
            const error: any = new Error('User not found');
            error.statusCode = httpStatusCodes.NOT_FOUND;
            throw error;
        }

        return userRepository.softDelete(id);
    }
}
