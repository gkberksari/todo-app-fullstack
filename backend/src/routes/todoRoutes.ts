import express from 'express';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} from '../controllers/todoController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Tüm rotaları Auth middleware ile koru
router.use(authenticateToken);

router.get('/', getAllTodos);
router.get('/:id', getTodoById);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;