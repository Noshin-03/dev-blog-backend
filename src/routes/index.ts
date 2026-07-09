import { Router } from 'express';
import healthRoute from './health_route';
import userRoutes from './user_route';

const routes = Router();

routes.use('/health', healthRoute);
routes.use('/users', userRoutes);

export default routes;
