import express from 'express';
import routes from './routes/index';
import { notFound, errorHandler } from './middlewares';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
    res.send('Server is running');
});

app.use(routes);

app.use(notFound);
app.use(errorHandler);

export default app;
