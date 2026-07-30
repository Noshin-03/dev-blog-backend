import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes/index';
import { notFound, errorHandler } from './middlewares';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import cors from 'cors';

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        customSiteTitle: 'DevBlog API Docs',
        customCss: '.swagger-ui .topbar { display: none }',
    }),
);

app.use(routes);

app.use(notFound);
app.use(errorHandler);

export default app;
