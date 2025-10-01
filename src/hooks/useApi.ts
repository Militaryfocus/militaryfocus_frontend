"use client";

import { useState, useEffect, useCallback } from 'react';
import { authService, newsService, commentsService, usersService } from '@/api/services';

// Хук для аутентификации
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверка аутентификации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('military_focus_token');
        if (token) {
          const response = await authService.checkAuth();
          if (response.success) {
            setUser(response.data);
            setIsAuthenticated(true);
          } else {
            // Токен недействителен, очищаем
            localStorage.removeItem('military_focus_token');
            localStorage.removeItem('military_focus_refresh');
          }
        }
      } catch (error) {
        console.error('Ошибка проверки аутентификации:', error);
        localStorage.removeItem('military_focus_token');
        localStorage.removeItem('military_focus_refresh');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message || 'Ошибка входа' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Ошибка входа' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      setIsLoading(true);
      const response = await authService.register({ name, email, password, confirmPassword });
      
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message || 'Ошибка регистрации' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Ошибка регистрации' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
}

// Хук для работы с новостями
export function useNews() {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchNews = useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await newsService.getNews(params);
      
      if (response.success) {
        setNews(response.data.articles);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Ошибка загрузки новостей');
      }
    } catch (error: any) {
      setError(error.message || 'Ошибка загрузки новостей');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchNews = useCallback(async (query: string, params = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await newsService.searchNews(query, params);
      
      if (response.success) {
        setNews(response.data.articles);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Ошибка поиска');
      }
    } catch (error: any) {
      setError(error.message || 'Ошибка поиска');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getNewsById = useCallback(async (id: number) => {
    try {
      const response = await newsService.getNewsById(id);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Ошибка загрузки новости');
      }
    } catch (error: any) {
      throw error;
    }
  }, []);

  const likeNews = useCallback(async (id: number) => {
    try {
      const response = await newsService.toggleLike(id);
      
      if (response.success) {
        // Обновляем локальное состояние
        setNews(prevNews => 
          prevNews.map(article => 
            article.id === id 
              ? { ...article, likes: response.data.likesCount, isLiked: response.data.liked }
              : article
          )
        );
        return response.data;
      } else {
        throw new Error(response.message || 'Ошибка лайка');
      }
    } catch (error: any) {
      throw error;
    }
  }, []);

  return {
    news,
    isLoading,
    error,
    pagination,
    fetchNews,
    searchNews,
    getNewsById,
    likeNews,
  };
}

// Хук для работы с комментариями
export function useComments(newsId: number) {
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await commentsService.getComments(newsId);
      
      if (response.success) {
        setComments(response.data);
      } else {
        setError(response.message || 'Ошибка загрузки комментариев');
      }
    } catch (error: any) {
      setError(error.message || 'Ошибка загрузки комментариев');
    } finally {
      setIsLoading(false);
    }
  }, [newsId]);

  const addComment = useCallback(async (content: string, parentId?: number) => {
    try {
      const response = await commentsService.createComment({
        content,
        newsId,
        parentId,
      });
      
      if (response.success) {
        setComments(prevComments => [response.data, ...prevComments]);
        return response.data;
      } else {
        throw new Error(response.message || 'Ошибка добавления комментария');
      }
    } catch (error: any) {
      throw error;
    }
  }, [newsId]);

  const likeComment = useCallback(async (commentId: number) => {
    try {
      const response = await commentsService.likeComment(commentId);
      
      if (response.success) {
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === commentId
              ? { ...comment, likes: response.data.likesCount, isLiked: response.data.liked }
              : comment
          )
        );
        return response.data;
      } else {
        throw new Error(response.message || 'Ошибка лайка комментария');
      }
    } catch (error: any) {
      throw error;
    }
  }, []);

  useEffect(() => {
    if (newsId) {
      fetchComments();
    }
  }, [newsId, fetchComments]);

  return {
    comments,
    isLoading,
    error,
    addComment,
    likeComment,
    refetch: fetchComments,
  };
}

// Хук для работы с пользователем
export function useUser() {
  const [profile, setProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await usersService.getProfile();
      
      if (response.success) {
        setProfile(response.data);
      } else {
        setError(response.message || 'Ошибка загрузки профиля');
      }
    } catch (error: any) {
      setError(error.message || 'Ошибка загрузки профиля');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData: any) => {
    try {
      const response = await usersService.updateProfile(profileData);
      
      if (response.success) {
        setProfile(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Ошибка обновления профиля');
      }
    } catch (error: any) {
      throw error;
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await usersService.getFavorites();
      
      if (response.success) {
        setFavorites(response.data);
      } else {
        setError(response.message || 'Ошибка загрузки избранного');
      }
    } catch (error: any) {
      setError(error.message || 'Ошибка загрузки избранного');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToFavorites = useCallback(async (newsId: number) => {
    try {
      await usersService.addToFavorites(newsId);
      setFavorites(prevFavorites => [...prevFavorites, { id: newsId }]);
    } catch (error: any) {
      throw error;
    }
  }, []);

  const removeFromFavorites = useCallback(async (newsId: number) => {
    try {
      await usersService.removeFromFavorites(newsId);
      setFavorites(prevFavorites => prevFavorites.filter(item => item.id !== newsId));
    } catch (error: any) {
      throw error;
    }
  }, []);

  return {
    profile,
    favorites,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
  };
}

// Хук для WebSocket подключения
export function useWebSocket(endpoint: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connect = () => {
      try {
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}${endpoint}`);
        
        ws.onopen = () => {
          setIsConnected(true);
          setError(null);
        };
        
        ws.onclose = () => {
          setIsConnected(false);
        };
        
        ws.onerror = () => {
          setError('Ошибка WebSocket подключения');
          setIsConnected(false);
        };
        
        setSocket(ws);
      } catch {
        setError('Ошибка создания WebSocket подключения');
      }
    };

    connect();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [endpoint, socket]);

  const sendMessage = useCallback((message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  }, [socket, isConnected]);

  return {
    socket,
    isConnected,
    error,
    sendMessage,
  };
}