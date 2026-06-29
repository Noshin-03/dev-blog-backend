import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();

router.post('/', UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:userId', UserController.getUserById);
router.put('/:userId', UserController.updateUser);
router.patch('/:userId', UserController.updateUser);
router.delete('/:userId', UserController.deleteUser);

export default router;