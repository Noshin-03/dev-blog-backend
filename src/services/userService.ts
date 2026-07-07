import prisma from '../config/prisma';
import { UserRepository } from '../repositories/userRepository';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '../dtos/userDTO';
import { NotFoundError, ConflictError } from '../common/errorsClass';
import { Messages } from '../constants/messages';

const userRepository = new UserRepository(prisma);

export class UserService {
    async createUser(data: CreateUserDTO): Promise<UserResponseDTO> {
        if (await userRepository.checkByEmail(data.email)) {
            throw new ConflictError(Messages.EMAIL_ALREADY_IN_USE);
        }

        if (await userRepository.checkByUsername(data.username)) {
            throw new ConflictError(Messages.USERNAME_ALREADY_IN_USE);
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
            throw new NotFoundError(Messages.USER_NOT_FOUND);
        }

        return new UserResponseDTO(user);
    }

    async updateUser(
        id: string,
        data: UpdateUserDTO,
    ): Promise<UserResponseDTO> {
        const existingUser = await userRepository.checkById(id);

        if (!existingUser) {
            throw new NotFoundError(Messages.USER_NOT_FOUND);
        }

        const updated = await userRepository.update(id, data);

        return new UserResponseDTO(updated);
    }

    async softDeleteUser(id: string): Promise<UserResponseDTO> {
        const existingUser = await userRepository.checkById(id);

        if (!existingUser) {
            throw new NotFoundError(Messages.USER_NOT_FOUND);
        }

        const deleted = await userRepository.softDelete(id);

        return new UserResponseDTO(deleted);
    }
}
