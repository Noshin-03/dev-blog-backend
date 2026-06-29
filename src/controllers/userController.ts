import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { asyncHandler } from '../utils/asyncHandler';

const userService = new UserService();

export const UserController = {
    createUser: asyncHandler(async (req: Request, res: Response) => {
        const user = await userService.createUser(req.body);
        res.status(201).json({ 
            status: 'success', 
            data: user 
        });
    }),

    getAllUsers: asyncHandler(async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const users = await userService.getAllUsers({ page, limit });
        res.status(200).json({ 
            status: 'success', data: users 
        });
    }),

    getUserById: asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.userId);
        const user = await userService.getUserById(id);
        res.status(200).json({ 
            status: 'success', 
            data: user 
        });
    }),

    updateUser: asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.userId);
        const user = await userService.updateUser(id, req.body);
        res.status(200).json({ 
            status: 'success', 
            data: user 
        });
    }),

    deleteUser: asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.userId);
        await userService.softDeleteUser(id);
        res.status(200).json({ 
            status: 'success', 
            message: 'User deleted successfully' 
        });
    }),
};