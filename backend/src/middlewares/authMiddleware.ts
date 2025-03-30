import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  // Authorization header'dan token'ı al
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN" formatı

  if (!token) {
    res.status(401).json({ error: 'Yetkilendirme token\'ı gerekli' });
    return;
  }

  try {
    // Token'ı doğrula
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // İsteğe kullanıcı bilgisini ekle
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Error authenticating token:', error);
    res.status(403).json({ error: 'Geçersiz token' });
  }
};