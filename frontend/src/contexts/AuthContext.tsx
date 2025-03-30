import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { User, AuthState, LoginFormData, RegisterFormData, AuthResponse } from '../types';
import { authApi, setAuthToken } from '../services/api';

interface AuthContextType extends AuthState {
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
}

// Default context değerleri
const defaultAuthContext: AuthContextType = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
};

// Context oluştur
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Hook oluştur
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data.email, data.password),
    onSuccess: (data: AuthResponse) => {
      const { token, user } = data;

      // Token ayarla
      setAuthToken(token);

      // Kullanıcı bilgisini localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify(user));

      setState({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      let errorMessage = 'Giriş sırasında bir hata oluştu';

      if (error.response) {
        errorMessage = error.response.data?.error || errorMessage;
      }

      setState({
        ...state,
        isLoading: false,
        error: errorMessage,
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => authApi.register(data.name, data.email, data.password),
    onSuccess: (data: AuthResponse) => {
      const { token, user } = data;

      // Token ayarla
      setAuthToken(token);

      // Kullanıcı bilgisini localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify(user));

      setState({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    },
    onError: (error: any) => {
      console.error('Register error:', error);
      let errorMessage = 'Kayıt sırasında bir hata oluştu';

      if (error.response) {
        errorMessage = error.response.data?.error || errorMessage;
      }

      setState({
        ...state,
        isLoading: false,
        error: errorMessage,
      });
    },
  });

  // Sayfa yüklendiğinde localStorage'dan token ve user bilgisini al
  useEffect(() => {
    const loadUserFromStorage = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as User;

          // Token ayarla
          setAuthToken(token);

          setState({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // JSON parse hatası
          setState({
            ...state,
            isLoading: false,
          });
        }
      } else {
        setState({
          ...state,
          isLoading: false,
        });
      }
    };

    loadUserFromStorage();
  }, []);

  // Login işlevi
  const login = async (data: LoginFormData): Promise<void> => {
    setState({ ...state, isLoading: true, error: null });
    await loginMutation.mutateAsync(data);
  };

  // Register işlevi
  const register = async (data: RegisterFormData): Promise<void> => {
    setState({ ...state, isLoading: true, error: null });
    await registerMutation.mutateAsync(data);
  };

  // Logout işlevi
  const logout = (): void => {
    // localStorage'dan yetkilendirme bilgilerini sil
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Token temizle
    setAuthToken(null);

    // State'i sıfırla
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  // Context değerlerini sağla
  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
