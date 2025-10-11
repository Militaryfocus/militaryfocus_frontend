import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest } from '../types';
import apiService from './api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Проверка токена при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await apiService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('access_token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await apiService.login(credentials);
      
      // Сохраняем токен
      localStorage.setItem('access_token', response.access_token);
      
      // Получаем данные пользователя
      const userData = await apiService.getCurrentUser();
      setUser(userData);
      
      toast.success('Успешный вход в систему!');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Ошибка входа в систему';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      const newUser = await apiService.register(userData);
      
      // Автоматически входим после регистрации
      await login({
        username: userData.username,
        password: userData.password,
      });
      
      toast.success('Регистрация прошла успешно!');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Ошибка регистрации';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    toast.success('Вы вышли из системы');
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = await apiService.updateUser(user.id, userData);
      setUser(updatedUser);
      toast.success('Профиль обновлен!');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Ошибка обновления профиля';
      toast.error(message);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Хук для проверки ролей
export function useRole() {
  const { user } = useAuth();
  
  const hasRole = (role: string) => {
    return user?.role === role;
  };
  
  const hasAnyRole = (roles: string[]) => {
    return user && roles.includes(user.role);
  };
  
  const isAdmin = () => {
    return hasAnyRole(['Admin', 'Moderator']);
  };
  
  const isContentCreator = () => {
    return hasAnyRole(['Content Creator', 'Moderator', 'Admin']);
  };
  
  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    isContentCreator,
    userRole: user?.role,
  };
}