import { Router } from 'express';
import healthRoute from './healthRoute';
import userRoutes from './userRoute';
import storyRoutes from './storyRoute';
import authRoutes from './authRoute';
import categoryRoutes from './categoryRoutes';
import newsletterRoutes from './newsLetterRoute';

const routes = Router();

routes.use('/health', healthRoute);
routes.use('/users', userRoutes);
routes.use('/auth', authRoutes);
routes.use('/stories/category', categoryRoutes);
routes.use('/stories', storyRoutes);
routes.use('/newsletter', newsletterRoutes);
export default routes;
