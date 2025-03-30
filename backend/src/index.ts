import express, { Express } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import todoRoutes from './routes/todoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import specs from './config/swagger.js';

const app: Express = express();
const prisma = new PrismaClient();
const PORT: number = parseInt(process.env.PORT || '3001', 10);

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Dokümantasyonu
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Error Handling Middleware - en sonda olmalı
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
  console.log(`Swagger dokümantasyonu: http://localhost:${PORT}/api-docs`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
