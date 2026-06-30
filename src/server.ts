import app from './app';
import 'dotenv/config';
import prisma from './config/prisma';

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Server is running');
});

async function startServer() {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

startServer();
