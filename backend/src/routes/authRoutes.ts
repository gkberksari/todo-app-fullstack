import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Açık rotalar
router.post('/register', register);
router.post('/login', login);

// Korumalı rotalar
router.get('/profile', authenticateToken, getProfile);

export default router;