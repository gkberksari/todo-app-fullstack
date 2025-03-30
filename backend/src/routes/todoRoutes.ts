import express from 'express';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           description: Todo ID
 *         title:
 *           type: string
 *           description: Todo başlığı
 *         description:
 *           type: string
 *           description: Todo açıklaması (isteğe bağlı)
 *         completed:
 *           type: boolean
 *           description: Todo'nun tamamlanma durumu
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Oluşturulma tarihi
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Güncellenme tarihi
 *         userId:
 *           type: string
 *           description: Todo'nun sahibi olan kullanıcı ID'si
 *       example:
 *         id: "clrtz9xjf0001pxy3vwqi4qw2"
 *         title: "Alışveriş yap"
 *         description: "Süt, ekmek ve yumurta al"
 *         completed: false
 *         createdAt: "2025-03-30T10:00:00Z"
 *         updatedAt: "2025-03-30T10:00:00Z"
 *         userId: "clrtz8cjf0000pxy3xeqi4qw1"
 *
 *     TodoInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: Todo başlığı
 *         description:
 *           type: string
 *           description: Todo açıklaması (isteğe bağlı)
 *       example:
 *         title: "Alışveriş yap"
 *         description: "Süt, ekmek ve yumurta al"
 *
 *     TodoUpdateInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: Todo başlığı
 *         description:
 *           type: string
 *           description: Todo açıklaması (isteğe bağlı)
 *         completed:
 *           type: boolean
 *           description: Todo'nun tamamlanma durumu
 *       example:
 *         title: "Alışveriş yap"
 *         description: "Süt, ekmek, yumurta ve peynir al"
 *         completed: true
 *
 *     PaginatedTodosResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Todo'
 *         meta:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               description: Mevcut sayfa numarası
 *             limit:
 *               type: integer
 *               description: Sayfa başına öğe sayısı
 *             totalCount:
 *               type: integer
 *               description: Toplam öğe sayısı
 *             totalPages:
 *               type: integer
 *               description: Toplam sayfa sayısı
 *             hasNextPage:
 *               type: boolean
 *               description: Sonraki sayfa var mı
 *             hasPrevPage:
 *               type: boolean
 *               description: Önceki sayfa var mı
 *       example:
 *         data:
 *           - id: "clrtz9xjf0001pxy3vwqi4qw2"
 *             title: "Alışveriş yap"
 *             description: "Süt, ekmek ve yumurta al"
 *             completed: false
 *             createdAt: "2025-03-30T10:00:00Z"
 *             updatedAt: "2025-03-30T10:00:00Z"
 *             userId: "clrtz8cjf0000pxy3xeqi4qw1"
 *         meta:
 *           page: 1
 *           limit: 10
 *           totalCount: 25
 *           totalPages: 3
 *           hasNextPage: true
 *           hasPrevPage: false
 */

// Tüm rotaları Auth middleware ile koru
router.use(authenticateToken);

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Kullanıcının tüm todo'larını getir
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Sayfa başına öğe sayısı
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed]
 *         description: Todo durumuna göre filtrele (isteğe bağlı)
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, title]
 *           default: createdAt
 *         description: Sıralama alanı
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sıralama yönü
 *     responses:
 *       200:
 *         description: Todo listesi başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedTodosResponse'
 *       401:
 *         description: Yetkilendirme hatası
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
router.get('/', getAllTodos);

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: ID'ye göre todo getir
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Bu todo'ya erişim izni yok
 *       404:
 *         description: Todo bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.get('/:id', getTodoById);

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Yeni todo oluştur
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoInput'
 *     responses:
 *       201:
 *         description: Todo başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Geçersiz istek (başlık gereklidir)
 *       401:
 *         description: Yetkilendirme hatası
 *       500:
 *         description: Sunucu hatası
 */
router.post('/', createTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Todo güncelle
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoUpdateInput'
 *     responses:
 *       200:
 *         description: Todo başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Geçersiz istek (başlık gereklidir)
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Bu todo'yu güncelleme izni yok
 *       404:
 *         description: Todo bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.put('/:id', updateTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Todo sil
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       204:
 *         description: Todo başarıyla silindi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Bu todo'yu silme izni yok
 *       404:
 *         description: Todo bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.delete('/:id', deleteTodo);

export default router;
