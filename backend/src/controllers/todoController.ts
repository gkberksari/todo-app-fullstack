import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { TodoInput, TodoUpdateInput } from '../types/index.js';

const prisma = new PrismaClient();

// Tüm todo'ları getir (kullanıcıya özgü)
export const getAllTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    // Middleware'den gelen kullanıcı bilgisi
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Yetkilendirme başarısız' });
      return;
    }

    const todos = await prisma.todo.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Todos getirilirken bir hata oluştu' });
  }
};

// Tek bir todo'yu getir (ve kullanıcının erişimi var mı kontrol et)
export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Yetkilendirme başarısız' });
      return;
    }

    // id'yi string olarak kullanıyoruz (CUID)
    const todo = await prisma.todo.findUnique({
      where: { id: String(id) },
    });
    
    if (!todo) {
      res.status(404).json({ error: 'Todo bulunamadı' });
      return;
    }

    // Todo bu kullanıcıya ait mi kontrol et
    if (todo.userId !== userId) {
      res.status(403).json({ error: 'Bu todo\'ya erişim izniniz yok' });
      return;
    }
    
    res.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ error: 'Todo getirilirken bir hata oluştu' });
  }
};

// Yeni todo oluştur (kullanıcı id'si ile)
export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description }: TodoInput = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Yetkilendirme başarısız' });
      return;
    }
    
    if (!title) {
      res.status(400).json({ error: 'Başlık gereklidir' });
      return;
    }

    const newTodo = await prisma.todo.create({
      data: {
        title,
        description,
        userId // Kullanıcı ID'sini ekle
      },
    });

    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Todo oluşturulurken bir hata oluştu' });
  }
};

// Todo'yu güncelle (ve kullanıcının erişimi var mı kontrol et)
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, completed }: TodoUpdateInput = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Yetkilendirme başarısız' });
      return;
    }
    
    if (!title) {
      res.status(400).json({ error: 'Başlık gereklidir' });
      return;
    }

    // Önce todo'yu kontrol et
    const existingTodo = await prisma.todo.findUnique({
      where: { id: String(id) },
    });

    if (!existingTodo) {
      res.status(404).json({ error: 'Todo bulunamadı' });
      return;
    }

    // Todo bu kullanıcıya ait mi kontrol et
    if (existingTodo.userId !== userId) {
      res.status(403).json({ error: 'Bu todo\'yu güncelleme izniniz yok' });
      return;
    }
    
    // id'yi string olarak kullanıyoruz (CUID)
    const updatedTodo = await prisma.todo.update({
      where: { id: String(id) },
      data: {
        title,
        description,
        completed: completed !== undefined ? completed : undefined,
      },
    });
    
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Todo güncellenirken bir hata oluştu' });
  }
};

// Todo'yu sil (ve kullanıcının erişimi var mı kontrol et)
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Yetkilendirme başarısız' });
      return;
    }

    // Önce todo'yu kontrol et
    const existingTodo = await prisma.todo.findUnique({
      where: { id: String(id) },
    });

    if (!existingTodo) {
      res.status(404).json({ error: 'Todo bulunamadı' });
      return;
    }

    // Todo bu kullanıcıya ait mi kontrol et
    if (existingTodo.userId !== userId) {
      res.status(403).json({ error: 'Bu todo\'yu silme izniniz yok' });
      return;
    }
    
    // id'yi string olarak kullanıyoruz (CUID)
    await prisma.todo.delete({
      where: { id: String(id) },
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Todo silinirken bir hata oluştu' });
  }
};