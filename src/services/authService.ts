import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { AuthRepository } from '../repositories/authRepository';
import { RegisterDTO, LoginDto, ChangepasswordDTO } from '../dtos/authDTO';
import { signToken } from '../utils/jwt';
import { ConflictError, UnauthorizedError } from '../common/errorsClass';
import { Messages } from '../constants/messages';
import { UserService } from './userService';
import { AccountRepository } from '../repositories/accountRepository';

const SALT_ROUNDS = 10;

const accountRepository = new AccountRepository(prisma);
const authRepository = new AuthRepository(prisma);
const userService = new UserService();

export class AuthService {
    async signup(data: RegisterDTO) {
        const exitingEmail = await userService.checkByEmail(data.email);
        if (exitingEmail) {
            throw new ConflictError(Messages.EMAIL_ALREADY_IN_USE);
        }

        const existingUsername = await userService.checkByUsername(
            data.username,
        );
        if (existingUsername) {
            throw new ConflictError(Messages.USERNAME_ALREADY_IN_USE);
        }

        const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

        const user = await accountRepository.createUserWithAuth({
            username: data.username,
            name: data.name,
            email: data.email,
            passwordHash,
        });

        const token = signToken({
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        });

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
            },
        };
    }

    async login(data: LoginDto) {
        const user = await userService.getUserByEmail(data.email);

        const auth = await authRepository.checkAuthByUserId(user.id);
        if (!user || !auth) {
            throw new UnauthorizedError(Messages.INVALID_CREDENTIALS);
        }

        const passwordMatch = await bcrypt.compare(
            data.password,
            auth.password,
        );

        if (!passwordMatch) {
            throw new UnauthorizedError(Messages.INVALID_CREDENTIALS);
        }

        const token = signToken({
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        });

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
            },
        };
    }

    async changePassword(userId: string, data: ChangepasswordDTO) {
        const auth = await authRepository.checkAuthByUserId(userId);
        if (!auth) {
            throw new UnauthorizedError(Messages.INVALID_CREDENTIALS);
        }

        const passwordMatch = await bcrypt.compare(
            data.oldPassword,
            auth.password,
        );

        if (!passwordMatch) {
            throw new UnauthorizedError(Messages.INVALID_CREDENTIALS);
        }

        const passwordHash = await bcrypt.hash(data.newPassword, SALT_ROUNDS);
        await authRepository.changePassword(userId, passwordHash);

        return Messages.CHANGED;
    }
}
