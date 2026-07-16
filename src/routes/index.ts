import { Router } from 'express';
import healthRoute from './health_route';
import userRoutes from './user_route';
import storyRoutes from './story_route';
import authRoutes from './auth_route';

const routes = Router();

routes.use('/health', healthRoute);
routes.use('/users', userRoutes);
routes.use('/stories', storyRoutes);
routes.use('/auth', authRoutes);

export default routes;
