import prisma from '../config/prisma';
import { UserRepository } from '../repositories/userRepository';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '../dtos/userDTO';
import { NotFoundError, ConflictError } from '../common';

const userRepository = new UserRepository(prisma);

export class UserService {
    async createUser(data: CreateUserDTO): Promise<UserResponseDTO> {
        const existingEmail = await userRepository.getUserByEmail(data.email);

        if (existingEmail) {
            throw new ConflictError('Email already in use');
        }

        const existingUsername = await userRepository.getUserByUsername(
            data.username,
        );

        if (existingUsername) {
            throw new ConflictError('Username already in use');
        }

        const user = await userRepository.create(data);

        return new UserResponseDTO(user);
    }

    async getAllUsers(): Promise<UserResponseDTO[]> {
        const users = await userRepository.getAllUser();

        return users.map((user) => new UserResponseDTO(user));
    }

    async getUserById(id: string): Promise<UserResponseDTO> {
        const user = await userRepository.getUserById(id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return new UserResponseDTO(user);
    }

    async updateUser(
        id: string,
        data: UpdateUserDTO,
    ): Promise<UserResponseDTO> {
        const existingUser = await userRepository.getUserById(id);

        if (!existingUser) {
            throw new NotFoundError('User not found');
        }

        const updated = await userRepository.update(id, data);

        return new UserResponseDTO(updated);
    }

    async softDeleteUser(id: string): Promise<UserResponseDTO> {
        const existingUser = await userRepository.getUserById(id);

        if (!existingUser) {
            throw new NotFoundError('User not found');
        }

        const deleted = await userRepository.softDelete(id);

        return new UserResponseDTO(deleted);
    }
}
