import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { getAllTodos, createTodo, getTodoById, updateTodo, deleteTodo } from '../../src/controllers/todoController';

// Mock dependencies
jest.mock('@prisma/client', () => {
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'test-user-id'
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      todo: {
        findMany: jest.fn().mockResolvedValue([mockTodo]),
        count: jest.fn().mockResolvedValue(1),
        findUnique: jest.fn().mockResolvedValue(mockTodo),
        create: jest.fn().mockImplementation((data) => Promise.resolve({
          id: '1',
          ...data.data,
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        update: jest.fn().mockImplementation((data) => Promise.resolve({
          id: data.where.id,
          ...data.data,
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        delete: jest.fn().mockResolvedValue(mockTodo)
      },
      $disconnect: jest.fn()
    }))
  };
});

describe('TodoController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockSend: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnThis();
    mockSend = jest.fn().mockReturnThis();
    
    req = {
      user: { userId: 'test-user-id', email: 'test@example.com' },
      params: {},
      query: {},
      body: {}
    };
    
    res = {
      json: mockJson,
      status: mockStatus,
      send: mockSend
    };
  });

  describe('getAllTodos', () => {
    it('should return all todos with pagination', async () => {
      req.query = { page: '1', limit: '10' };
      
      await getAllTodos(req as Request, res as Response);
      
      expect(mockJson).toHaveBeenCalledWith({
        data: expect.any(Array),
        meta: expect.objectContaining({
          page: 1,
          limit: 10,
          totalCount: 1
        })
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      req.user = undefined;
      
      await getAllTodos(req as Request, res as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      req.body = { title: 'New Todo', description: 'New Description' };
      
      await createTodo(req as Request, res as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Todo',
        description: 'New Description'
      }));
    });

    it('should return 400 if title is missing', async () => {
      req.body = { description: 'New Description' };
      
      await createTodo(req as Request, res as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });

  describe('getTodoById', () => {
    it('should return a todo by id', async () => {
      req.params = { id: '1' };
      
      await getTodoById(req as Request, res as Response);
      
      expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
        id: '1',
        title: 'Test Todo'
      }));
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      req.params = { id: '1' };
      req.body = { title: 'Updated Todo', description: 'Updated Description', completed: true };
      
      await updateTodo(req as Request, res as Response);
      
      expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Updated Todo',
        description: 'Updated Description',
        completed: true
      }));
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      req.params = { id: '1' };
      
      await deleteTodo(req as Request, res as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockSend).toHaveBeenCalled();
    });
  });
});