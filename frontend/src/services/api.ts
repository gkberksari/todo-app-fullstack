import axios from 'axios';
import { Todo, TodoFormData } from '../types';

const API_URL = 'http://localhost:3001/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
});

// Token ayarlama fonksiyonu
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Başlangıçta localStorage'dan token al
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

// Todo API servisleri
export const todoApi = {
  // Tüm todoları getir
  getAllTodos: async (): Promise<Todo[]> => {
    const response = await api.get<Todo[]>('/todos');
    return response.data;
  },

  // ID'ye göre todo getir
  getTodoById: async (id: string): Promise<Todo> => {
    const response = await api.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  // Yeni todo oluştur
  createTodo: async (todo: TodoFormData): Promise<Todo> => {
    const response = await api.post<Todo>('/todos', todo);
    return response.data;
  },

  // Todo güncelle
  updateTodo: async (id: string, todo: TodoFormData & { completed?: boolean }): Promise<Todo> => {
    const response = await api.put<Todo>(`/todos/${id}`, todo);
    return response.data;
  },

  // Todo sil
  deleteTodo: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  }
};

// Auth API servisleri
export const authApi = {
  // Giriş yap
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Kayıt ol
  register: async (name: string | undefined, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  // Profil bilgilerini getir
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

export default api;