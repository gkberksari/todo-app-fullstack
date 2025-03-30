export interface TodoInput {
  title: string;
  description?: string;
}

export interface TodoUpdateInput extends TodoInput {
  completed?: boolean;
}

export interface ErrorResponse {
  error: string;
  details?: any;
}

export interface Todo {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  password?: string; // Yalnızca dahili kullanım için, yanıtlarda gönderilmemeli
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegisterInput {
  name?: string;
  email: string;
  password: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

// Express request nesnesine kullanıcı eklemek için genişletme
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}