import { Response } from 'express';
import { UserService } from '../services/userService';
import { asyncHandler } from '../utils/asyncHandler';
import { httpStatusCodes } from '../constants/statusCode';
import { sendResponse } from '../utils/response';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/userDTO';
import { UserQueryParams } from '../schemas/querySchema';
import { getBody, getParams, getQuery } from '../utils/request';

const userService = new UserService();

export const UserController = {
    createUser: asyncHandler(async (req, res: Response) => {
        const user = await userService.createUser(req.body);
        sendResponse(res, httpStatusCodes.CREATED, user);
    }),

    getAllUsers: asyncHandler(async (req, res) => {
        const query = getQuery<UserQueryParams>(req);
        const users = await userService.getAllUsers(query);
        sendResponse(res, httpStatusCodes.OK, users);
    }),

    getUserById: asyncHandler(async (req, res: Response) => {
        const userId = req.params.userId as string;
        const user = await userService.getUserById(userId);
        sendResponse(res, httpStatusCodes.OK, user);
    }),

    updateUser: asyncHandler(async (req, res: Response) => {
        const userId = req.params.userId as string;
        const user = await userService.updateUser(userId, req.body);
        sendResponse(res, httpStatusCodes.OK, user);
    }),

    deleteUser: asyncHandler(async (req, res: Response) => {
        const userId = req.params.userId as string;
        await userService.softDeleteUser(userId);
        sendResponse(res, httpStatusCodes.OK, undefined);
    }),
};
