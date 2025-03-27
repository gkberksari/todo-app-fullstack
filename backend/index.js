const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes/Endpoints
// 1. Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Todos getirilirken bir hata oluştu' });
  }
});

// 2. Get unique todo
app.get('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await prisma.todo.findUnique({
      where: { id: Number(id) },
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo bulunamadı' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ error: 'Todo getirilirken bir hata oluştu' });
  }
});

// 3. Create new todo endopoint
app.post('/api/todos', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Başlık gereklidir' });
    }

    const newTodo = await prisma.todo.create({
      data: {
        title,
        description,
      },
    });

    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Todo oluşturulurken bir hata oluştu' });
  }
});

// Update todo endpoint
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Başlık gereklidir' });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: Number(id) },
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
});

// Delete todo endpoint
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.todo.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Todo silinirken bir hata oluştu' });
  }
});

// Server start
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});

// Prisma disconnect
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});