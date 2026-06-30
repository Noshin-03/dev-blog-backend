import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { asyncHandler } from '../utils/asyncHandler';
import { httpStatusCodes, paginationDefaults } from '../constants/statusCode';
import { sendResponse } from '../utils/response';

const userService = new UserService();

export const UserController = {
    createUser: asyncHandler(async (req: Request, res: Response) => {
        const user = await userService.createUser(req.body);
        sendResponse(res, httpStatusCodes.CREATED, user);
    }),

    getAllUsers: asyncHandler(async (req: Request, res: Response) => {
        const page = Number(req.query.page) || paginationDefaults.PAGE;
        const limit = Number(req.query.limit) || paginationDefaults.LIMIT;
        const users = await userService.getAllUsers({ page, limit });
        sendResponse(res, httpStatusCodes.OK, users);
    }),

    getUserById: asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.userId);
        const user = await userService.getUserById(id);
        sendResponse(res, httpStatusCodes.OK, user);
    }),

    updateUser: asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.userId);
        const user = await userService.updateUser(id, req.body);
        sendResponse(res, httpStatusCodes.OK, user);
    }),

    deleteUser: asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.userId);
        await userService.softDeleteUser(id);
        sendResponse(res, httpStatusCodes.OK, undefined, 'User deleted successfully');
    }),
};
