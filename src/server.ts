import app from "./app.js";
import 'dotenv/config';
import prisma from './config/prisma.js';

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello");
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