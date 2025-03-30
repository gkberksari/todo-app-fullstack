import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: Kullanıcı ID'si
 *         email:
 *           type: string
 *           format: email
 *           description: Kullanıcı email adresi
 *         name:
 *           type: string
 *           description: Kullanıcı adı (isteğe bağlı)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Kullanıcı oluşturma tarihi
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Kullanıcı güncelleme tarihi
 *       example:
 *         id: "clrtz8cjf0000pxy3xeqi4qw1"
 *         email: "user@example.com"
 *         name: "John Doe"
 *         createdAt: "2025-03-30T10:00:00Z"
 *         updatedAt: "2025-03-30T10:00:00Z"
 *
 *     UserRegisterInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Kullanıcı email adresi
 *         password:
 *           type: string
 *           description: Kullanıcı şifresi (min 6 karakter)
 *         name:
 *           type: string
 *           description: Kullanıcı adı (isteğe bağlı)
 *       example:
 *         email: "new@example.com"
 *         password: "securepassword"
 *         name: "John Doe"
 *
 *     UserLoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Kullanıcı email adresi
 *         password:
 *           type: string
 *           description: Kullanıcı şifresi
 *       example:
 *         email: "user@example.com"
 *         password: "securepassword"
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token
 *         user:
 *           $ref: '#/components/schemas/User'
 *       example:
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           id: "clrtz8cjf0000pxy3xeqi4qw1"
 *           email: "user@example.com"
 *           name: "John Doe"
 *           createdAt: "2025-03-30T10:00:00Z"
 *           updatedAt: "2025-03-30T10:00:00Z"
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Hata mesajı
 *       example:
 *         error: "Email ve şifre gereklidir"
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegisterInput'
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Geçersiz istek (email/şifre eksik veya geçersiz)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Kullanıcı girişi
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginInput'
 *     responses:
 *       200:
 *         description: Giriş başarılı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Geçersiz istek (email/şifre eksik)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Geçersiz kimlik bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Giriş yapmış kullanıcının profil bilgilerini getir
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı profil bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Yetkilendirme hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/profile', authenticateToken, getProfile);

export default router;
