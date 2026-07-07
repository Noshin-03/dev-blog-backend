import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { asyncHandler } from '../utils/asyncHandler';
import { httpStatusCodes } from '../constants/statusCode';
import { sendResponse } from '../utils/response';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/userDTO';

type UserParams = {
    userId: string;
};

const getValidatedBody = <T>(req: Request): T => req.body as T;
const getValidatedParams = <T extends Record<string, string>>(
    req: Request,
): T => req.params as T;

const userService = new UserService();

export const UserController = {
    createUser: asyncHandler(async (req: Request, res: Response) => {
        const body = getValidatedBody<CreateUserDTO>(req);
        const user = await userService.createUser(body);
        sendResponse(res, httpStatusCodes.CREATED, user);
    }),

    getAllUsers: asyncHandler(async (_req: Request, res: Response) => {
        const users = await userService.getAllUsers();
        sendResponse(res, httpStatusCodes.OK, users);
    }),

    getUserById: asyncHandler(async (req: Request, res: Response) => {
        const { userId } = getValidatedParams<UserParams>(req);
        const user = await userService.getUserById(userId);
        sendResponse(res, httpStatusCodes.OK, user);
    }),

    updateUser: asyncHandler(async (req: Request, res: Response) => {
        const { userId } = getValidatedParams<UserParams>(req);
        const body = getValidatedBody<UpdateUserDTO>(req);
        const user = await userService.updateUser(userId, body);
        sendResponse(res, httpStatusCodes.OK, user);
    }),

    deleteUser: asyncHandler(async (req: Request, res: Response) => {
        const { userId } = getValidatedParams<UserParams>(req);
        await userService.softDeleteUser(userId);
        sendResponse(res, httpStatusCodes.OK, undefined);
    }),
};
