import prisma from '../config/prisma';
import { UserRepository } from '../repositories/userRepository';
import { CreateUserDTO } from '../dtos/userDTO';
import { PaginationParams } from '../schemas/querySchema';

const userRepository = new UserRepository(prisma);

export class UserService {
    async createUser(data: CreateUserDTO) {
        const [existingEmail, existingUsername] = await Promise.all([
            userRepository.getUserByEmail(data.email),
            userRepository.getUserByUsernameALL(data.username),
        ]);

        if(existingEmail) {
            const error: any = new Error('Email already in use');
            error.statusCode = 409;
            throw error;
        }

        if(existingUsername) {
            const error: any = new Error('Username already in use');
            error.statusCode = 409;
            throw error;
        }

        return userRepository.create(data);
    }

    async getAllUsers(paginationParams: PaginationParams) {
        return userRepository.findAll(paginationParams);
    }

    async getUserById(id: number) {
        const user = await userRepository.findById(id);
        if(!user) {
            const error: any = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }

    async updateUser(id: number, data: Partial<CreateUserDTO>) {
        const user = await userRepository.update(id, data);
        if(!user) {
            const error: any = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }

    async softDeleteUser(id: number) {
        const user = await userRepository.softDelete(id);
        if(!user) {
            const error: any = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }
}