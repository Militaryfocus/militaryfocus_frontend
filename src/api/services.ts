import { apiClient, API_ENDPOINTS, ApiResponse } from './apiClient';

// Типы для новостей
export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  tags: string[];
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  commentsCount: number;
  isFeatured: boolean;
  isBreaking: boolean;
  readingTime: number;
  slug: string;
}

export interface NewsListResponse {
  articles: NewsArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface NewsSearchParams {
  query?: string;
  category?: string;
  tag?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  featured?: boolean;
  breaking?: boolean;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'popular' | 'trending';
}

// Сервис для работы с новостями
export class NewsService {
  // Получение списка новостей
  async getNews(params?: NewsSearchParams): Promise<ApiResponse<NewsListResponse>> {
    return apiClient.get(API_ENDPOINTS.NEWS.LIST, params);
  }

  // Получение новости по ID
  async getNewsById(id: number): Promise<ApiResponse<NewsArticle>> {
    return apiClient.get(API_ENDPOINTS.NEWS.DETAIL.replace(':id', id.toString()));
  }

  // Поиск новостей
  async searchNews(query: string, params?: Omit<NewsSearchParams, 'query'>): Promise<ApiResponse<NewsListResponse>> {
    return apiClient.get(API_ENDPOINTS.NEWS.SEARCH, { query, ...params });
  }

  // Получение популярных новостей
  async getPopularNews(limit: number = 10): Promise<ApiResponse<NewsArticle[]>> {
    return apiClient.get(API_ENDPOINTS.NEWS.POPULAR, { limit });
  }

  // Получение последних новостей
  async getLatestNews(limit: number = 10): Promise<ApiResponse<NewsArticle[]>> {
    return apiClient.get(API_ENDPOINTS.NEWS.LATEST, { limit });
  }

  // Получение рекомендуемых новостей
  async getFeaturedNews(limit: number = 5): Promise<ApiResponse<NewsArticle[]>> {
    return apiClient.get(API_ENDPOINTS.NEWS.FEATURED, { limit });
  }

  // Получение категорий
  async getCategories(): Promise<ApiResponse<string[]>> {
    return apiClient.get(API_ENDPOINTS.NEWS.CATEGORIES);
  }

  // Создание новости (только для авторизованных пользователей)
  async createNews(newsData: Partial<NewsArticle>): Promise<ApiResponse<NewsArticle>> {
    return apiClient.post(API_ENDPOINTS.NEWS.CREATE, newsData);
  }

  // Обновление новости
  async updateNews(id: number, newsData: Partial<NewsArticle>): Promise<ApiResponse<NewsArticle>> {
    return apiClient.put(API_ENDPOINTS.NEWS.UPDATE.replace(':id', id.toString()), newsData);
  }

  // Удаление новости
  async deleteNews(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete(API_ENDPOINTS.NEWS.DELETE.replace(':id', id.toString()));
  }

  // Увеличение счетчика просмотров
  async incrementViews(id: number): Promise<ApiResponse<void>> {
    return apiClient.post(`/news/${id}/views`);
  }

  // Лайк/дизлайк новости
  async toggleLike(id: number): Promise<ApiResponse<{ liked: boolean; likesCount: number }>> {
    return apiClient.post(`/news/${id}/like`);
  }
}

// Типы для комментариев
export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  newsId: number;
  parentId?: number;
  replies?: Comment[];
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
  isDisliked?: boolean;
}

export interface CommentCreateData {
  content: string;
  newsId: number;
  parentId?: number;
}

// Сервис для работы с комментариями
export class CommentsService {
  // Получение комментариев к новости
  async getComments(newsId: number, page: number = 1, limit: number = 20): Promise<ApiResponse<Comment[]>> {
    return apiClient.get(API_ENDPOINTS.COMMENTS.LIST, { newsId, page, limit });
  }

  // Создание комментария
  async createComment(commentData: CommentCreateData): Promise<ApiResponse<Comment>> {
    return apiClient.post(API_ENDPOINTS.COMMENTS.CREATE, commentData);
  }

  // Обновление комментария
  async updateComment(id: number, content: string): Promise<ApiResponse<Comment>> {
    return apiClient.put(API_ENDPOINTS.COMMENTS.UPDATE.replace(':id', id.toString()), { content });
  }

  // Удаление комментария
  async deleteComment(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete(API_ENDPOINTS.COMMENTS.DELETE.replace(':id', id.toString()));
  }

  // Лайк комментария
  async likeComment(id: number): Promise<ApiResponse<{ liked: boolean; likesCount: number }>> {
    return apiClient.post(API_ENDPOINTS.COMMENTS.LIKE.replace(':id', id.toString()));
  }

  // Дизлайк комментария
  async dislikeComment(id: number): Promise<ApiResponse<{ disliked: boolean; dislikesCount: number }>> {
    return apiClient.post(API_ENDPOINTS.COMMENTS.DISLIKE.replace(':id', id.toString()));
  }
}

// Типы для пользователей
export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'moderator' | 'admin';
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
    emailNotifications: boolean;
  };
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserProfile {
  name: string;
  avatar?: string;
  bio?: string;
  preferences: User['preferences'];
}

// Сервис для работы с пользователями
export class UsersService {
  // Получение профиля пользователя
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get(API_ENDPOINTS.USERS.PROFILE);
  }

  // Обновление профиля
  async updateProfile(profileData: Partial<UserProfile>): Promise<ApiResponse<User>> {
    return apiClient.put(API_ENDPOINTS.USERS.UPDATE, profileData);
  }

  // Загрузка аватара
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    return apiClient.uploadFile(API_ENDPOINTS.USERS.AVATAR, file);
  }

  // Получение избранных новостей
  async getFavorites(): Promise<ApiResponse<NewsArticle[]>> {
    return apiClient.get(API_ENDPOINTS.USERS.FAVORITES);
  }

  // Добавление в избранное
  async addToFavorites(newsId: number): Promise<ApiResponse<void>> {
    return apiClient.post(API_ENDPOINTS.USERS.FAVORITES, { newsId });
  }

  // Удаление из избранного
  async removeFromFavorites(newsId: number): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.USERS.FAVORITES}/${newsId}`);
  }

  // Получение истории чтения
  async getHistory(): Promise<ApiResponse<NewsArticle[]>> {
    return apiClient.get(API_ENDPOINTS.USERS.HISTORY);
  }

  // Обновление настроек
  async updatePreferences(preferences: Partial<User['preferences']>): Promise<ApiResponse<User>> {
    return apiClient.put(API_ENDPOINTS.USERS.PREFERENCES, preferences);
  }
}

// Типы для аутентификации
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Сервис для аутентификации
export class AuthService {
  // Вход в систему
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    if (response.success && response.data) {
      // Сохраняем токены в localStorage
      localStorage.setItem('military_focus_token', response.data.token);
      localStorage.setItem('military_focus_refresh', response.data.refreshToken);
      
      // Устанавливаем токен в API клиент
      apiClient.setAuthToken(response.data.token);
    }
    
    return response;
  }

  // Регистрация
  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
    
    if (response.success && response.data) {
      // Сохраняем токены в localStorage
      localStorage.setItem('military_focus_token', response.data.token);
      localStorage.setItem('military_focus_refresh', response.data.refreshToken);
      
      // Устанавливаем токен в API клиент
      apiClient.setAuthToken(response.data.token);
    }
    
    return response;
  }

  // Выход из системы
  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
      return response;
    } finally {
      // Очищаем токены независимо от результата запроса
      localStorage.removeItem('military_focus_token');
      localStorage.removeItem('military_focus_refresh');
      apiClient.setAuthToken(null);
    }
  }

  // Обновление токена
  async refreshToken(): Promise<ApiResponse<{ token: string; refreshToken: string }>> {
    const refreshToken = localStorage.getItem('military_focus_refresh');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ token: string; refreshToken: string }>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
    
    if (response.success && response.data) {
      localStorage.setItem('military_focus_token', response.data.token);
      localStorage.setItem('military_focus_refresh', response.data.refreshToken);
      apiClient.setAuthToken(response.data.token);
    }
    
    return response;
  }

  // Проверка аутентификации
  async checkAuth(): Promise<ApiResponse<User>> {
    return apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
  }

  // Восстановление пароля
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  // Сброс пароля
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
  }
}

// Создаем экземпляры сервисов
export const newsService = new NewsService();
export const commentsService = new CommentsService();
export const usersService = new UsersService();
export const authService = new AuthService();