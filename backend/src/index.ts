import express, { Express } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import todoRoutes from './routes/todoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app: Express = express();
const prisma = new PrismaClient();
const PORT: number = parseInt(process.env.PORT || '3001', 10);

// Middleware
app.use(cors());
app.use(express.json());
// Error Handling Middleware - en sonda olmalı
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
