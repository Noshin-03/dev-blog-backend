import prisma from '../config/prisma';
import { UserRepository } from '../repositories/userRepository';
import { UpdateUserDTO, UserResponseDTO } from '../dtos/userDTO';
import { NotFoundError, ConflictError } from '../common/errorsClass';
import { Messages } from '../constants/messages';
import { UserQueryParams } from '../schemas/querySchema';
import { AccountRepository } from '../repositories/accountRepository';
import {
    OthersProfileDTO,
    ProfileResponseDTO,
    UpdateProfileDTO,
} from '../dtos/profileDTO';
import { signEmailToken } from '../utils/jwt';
import { sendVerificationEmail } from '../utils/mailer';

const userRepository = new UserRepository(prisma);
const accountRepository = new AccountRepository(prisma);

export class UserService {
    private async checkById(userId: string) {
        const existingUser = await userRepository.checkById(userId);

        if (!existingUser) {
            throw new NotFoundError(Messages.USER_NOT_FOUND);
        }

        return existingUser;
    }

    private async checkUpdateConflicts(
        id: string,
        data: { email?: string; username?: string },
    ): Promise<{ isVerified?: boolean }> {
        const user = await this.getUserById(id);

        if (data.email && data.email !== user.email) {
            const exists = await this.checkByEmail(data.email);

            if (exists) {
                throw new ConflictError(Messages.EMAIL_ALREADY_IN_USE);
            }

            return { isVerified: false };
        }

        if (data.username && data.username !== user.username) {
            const exists = await this.checkByUsername(data.username);

            if (exists) {
                throw new ConflictError(Messages.USERNAME_ALREADY_IN_USE);
            }
        }

        return {};
    }

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

    async getUserByUsername(username: string): Promise<OthersProfileDTO> {
        const user = await userRepository.getUserByUsername(username);

        if (!user) {
            throw new NotFoundError(Messages.USER_NOT_FOUND);
        }

        return new OthersProfileDTO(user);
    }

    async updateProfile(
        id: string,
        data: UpdateProfileDTO,
    ): Promise<ProfileResponseDTO> {
        const { isVerified } = await this.checkUpdateConflicts(id, data);

        const updateData = {
            ...data,
            ...(isVerified !== undefined && { isVerified }),
        };

        const updated = await userRepository.update(id, updateData);

        if (isVerified === false) {
            const emailToken = signEmailToken(updated.id);
            await sendVerificationEmail(updated.email, emailToken);
        }

        return new ProfileResponseDTO(updated);
    }

    async updateUser(
        id: string,
        data: UpdateUserDTO,
    ): Promise<UserResponseDTO> {
        const { isVerified } = await this.checkUpdateConflicts(id, data);

        const updateData = {
            ...data,
            ...(isVerified !== undefined && { isVerified }),
        };

        const updated = await userRepository.update(id, updateData);

        if (isVerified === false) {
            const emailToken = signEmailToken(updated.id);
            await sendVerificationEmail(updated.email, emailToken);
        }

        return new UserResponseDTO(updated);
    }

    async softDeleteUser(id: string): Promise<UserResponseDTO> {
        await this.checkById(id);

        const deleted = await accountRepository.softDeleteUserWithAuth(id);

        return new UserResponseDTO(deleted);
    }
}
