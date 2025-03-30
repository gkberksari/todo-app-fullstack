import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRegisterInput, UserLoginInput, AuthResponse, JwtPayload } from '../types/index.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Güvenlik için .env dosyasına taşıyın
const SALT_ROUNDS = 10;

// Kullanıcı kaydı
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password }: UserRegisterInput = req.body;

    // Giriş doğrulama
    if (!email || !password) {
      res.status(400).json({ error: 'Email ve şifre gereklidir' });
      return;
    }

    // Email formatı doğrulama
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Geçerli bir email adresi giriniz' });
      return;
    }

    // Şifre uzunluğu doğrulama
    if (password.length < 6) {
      res.status(400).json({ error: 'Şifre en az 6 karakter olmalıdır' });
      return;
    }

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'Bu email adresi ile kayıtlı bir kullanıcı zaten var' });
      return;
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Kullanıcıyı oluştur
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Kullanıcı verisinden şifreyi çıkar
    const { password: _, ...userWithoutPassword } = newUser;

    // JWT token oluştur
    const token = jwt.sign({ userId: newUser.id, email: newUser.email } as JwtPayload, JWT_SECRET, {
      expiresIn: '24h',
    });

    // Kullanıcı ve token bilgisini gönder
    const response: AuthResponse = {
      token,
      user: userWithoutPassword,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Kullanıcı kaydı sırasında bir hata oluştu' });
  }
};

// Kullanıcı girişi
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: UserLoginInput = req.body;

    // Giriş doğrulama
    if (!email || !password) {
      res.status(400).json({ error: 'Email ve şifre gereklidir' });
      return;
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ error: 'Geçersiz email veya şifre' });
      return;
    }

    // Şifreyi kontrol et
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Geçersiz email veya şifre' });
      return;
    }

    // Kullanıcı verisinden şifreyi çıkar
    const { password: _, ...userWithoutPassword } = user;

    // JWT token oluştur
    const token = jwt.sign({ userId: user.id, email: user.email } as JwtPayload, JWT_SECRET, {
      expiresIn: '24h',
    });

    // Kullanıcı ve token bilgisini gönder
    const response: AuthResponse = {
      token,
      user: userWithoutPassword,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Giriş sırasında bir hata oluştu' });
  }
};

// Kullanıcı bilgisi getir
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Middleware'den gelen kullanıcı bilgisi
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Yetkilendirme başarısız' });
      return;
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: 'Kullanıcı bulunamadı' });
      return;
    }

    // Kullanıcı verisinden şifreyi çıkar
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Profil bilgisi alınırken bir hata oluştu' });
  }
};
