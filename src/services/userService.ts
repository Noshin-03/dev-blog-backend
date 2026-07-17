import prisma from '../config/prisma';
import { UserRepository } from '../repositories/userRepository';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '../dtos/userDTO';
import { NotFoundError, ConflictError } from '../common/errorsClass';
import { Messages } from '../constants/messages';
import { UserQueryParams } from '../schemas/querySchema';
import { AccountRepository } from '../repositories/accountRepository';
import { ProfileResponseDTO, UpdateProfileDTO } from '../dtos/profileDTO';

const userRepository = new UserRepository(prisma);
const accountRepository = new AccountRepository(prisma);

export class UserService {
    async getAllUsers(params: UserQueryParams): Promise<UserResponseDTO[]> {
        const users = await userRepository.getAllUser(params);

        return users.map((user) => new UserResponseDTO(user));
    }

    async getUserById(id: string): Promise<UserResponseDTO> {
        const user = await userRepository.getUserById(id);

        if (!user) {
            throw new NotFoundError(Messages.USER_NOT_FOUND);
        }

        return new UserResponseDTO(user);
    }

    async getProfile(userId: string): Promise<ProfileResponseDTO> {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new NotFoundError(Messages.USER_NOT_FOUND);
        }
        return new ProfileResponseDTO(user);
    }
    //FIXME: same as updateUser
    async updateProfile(
        id: string,
        data: UpdateProfileDTO,
    ): Promise<ProfileResponseDTO> {
        const existingUser = await userRepository.checkById(id);

        if (!existingUser) {
            throw new NotFoundError(Messages.USER_NOT_FOUND);
        }

        const updated = await userRepository.update(id, data);

        return new ProfileResponseDTO(updated);
    }
    //FIXME: new email exists kore ki na, email change hoile verify korte hbe
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

        const deleted = await accountRepository.softDeleteUserWithAuth(id);

        return new UserResponseDTO(deleted);
    }

    async checkByEmail(email: string): Promise<boolean> {
        return await userRepository.checkByEmail(email);
    }

    async checkByUsername(username: string): Promise<boolean> {
        return await userRepository.checkByUsername(username);
    }

    async getUserByEmail(email: string): Promise<UserResponseDTO> {
        const user = await userRepository.getUserByEmail(email);

        if (!user) {
            throw new NotFoundError(Messages.USER_NOT_FOUND);
        }

        return new UserResponseDTO(user);
    }

    async getUserByUsername(username: string): Promise<UserResponseDTO> {
        const user = await userRepository.getUserByUsername(username);

        if (!user) {
            throw new NotFoundError(Messages.USER_NOT_FOUND);
        }

        return new UserResponseDTO(user);
    }
}
