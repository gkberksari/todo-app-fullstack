import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { register, login, getProfile } from '../../src/controllers/authController';

// Mock dependencies
jest.mock('@prisma/client', () => {
  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.email === 'existing@example.com') {
            return Promise.resolve(mockUser);
          }
          return Promise.resolve(null);
        }),
        create: jest.fn().mockImplementation(data =>
          Promise.resolve({
            id: 'new-user-id',
            ...data.data,
            password: 'hashedPassword',
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        ),
      },
      $disconnect: jest.fn(),
    })),
  };
});

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockImplementation((password, hash) => {
    return Promise.resolve(password === 'correct-password');
  }),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('test-token'),
}));

describe('AuthController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnThis();

    req = {
      body: {},
      user: { userId: 'user-id', email: 'test@example.com' },
    };

    res = {
      json: mockJson,
      status: mockStatus,
    };
  });

  describe('register', () => {
    it('should register a new user', async () => {
      req.body = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };

      await register(req as Request, res as Response);

      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          token: 'test-token',
          user: expect.objectContaining({
            email: 'new@example.com',
            name: 'New User',
          }),
        })
      );
    });

    it('should return 400 if email already exists', async () => {
      req.body = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123',
      };

      await register(req as Request, res as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: expect.any(String) });
    });

    it('should return 400 if email or password is missing', async () => {
      req.body = {
        name: 'New User',
      };

      await register(req as Request, res as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });

  describe('login', () => {
    it('should login an existing user', async () => {
      req.body = {
        email: 'existing@example.com',
        password: 'correct-password',
      };

      await login(req as Request, res as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          token: 'test-token',
          user: expect.objectContaining({
            email: 'existing@example.com',
          }),
        })
      );
    });

    it('should return 401 if email does not exist', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      await login(req as Request, res as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ error: expect.any(String) });
    });

    it('should return 401 if password is incorrect', async () => {
      req.body = {
        email: 'existing@example.com',
        password: 'wrong-password',
      };

      await login(req as Request, res as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      await getProfile(req as Request, res as Response);

      expect(mockStatus).not.toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalled();
    });

    it('should return 401 if user is not authenticated', async () => {
      req.user = undefined;

      await getProfile(req as Request, res as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });
});
