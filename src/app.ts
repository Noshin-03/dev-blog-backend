import express, { Request, Response, NextFunction } from 'express';
import healthRoute from './routes/health_route';
import userRoutes from './routes/user_route';

const app = express();

app.use(express.json());
app.use('/health', healthRoute);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

export default app;