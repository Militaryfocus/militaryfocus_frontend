import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Hero, 
  BuildGuide, 
  User, 
  News, 
  SearchResponse, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  HeroesStats,
  UserStats,
  GuideStats,
  NewsStats,
  SearchSuggestion,
  SearchSuggestionsResponse,
  HeroSearchResponse,
  GuideSearchResponse,
  UserSearchResponse,
  HealthCheckResponse,
  Comment
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8001/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Добавить токен к запросам если он есть
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Обработка ошибок
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Heroes API
  async getHeroes(params?: {
    skip?: number;
    limit?: number;
    role?: string;
    search?: string;
  }): Promise<Hero[]> {
    const response: AxiosResponse<Hero[]> = await this.api.get('/heroes', { params });
    return response.data;
  }

  async getHero(id: number): Promise<Hero> {
    const response: AxiosResponse<Hero> = await this.api.get(`/heroes/${id}`);
    return response.data;
  }

  async getHeroCounters(id: number): Promise<Hero[]> {
    const response: AxiosResponse<Hero[]> = await this.api.get(`/heroes/${id}/counters`);
    return response.data;
  }

  async getHeroSynergies(id: number): Promise<Hero[]> {
    const response: AxiosResponse<Hero[]> = await this.api.get(`/heroes/${id}/synergies`);
    return response.data;
  }

  async getHeroGuides(id: number, params?: {
    skip?: number;
    limit?: number;
  }): Promise<BuildGuide[]> {
    const response: AxiosResponse<BuildGuide[]> = await this.api.get(`/heroes/${id}/guides`, { params });
    return response.data;
  }

  async getHeroRoles(): Promise<string[]> {
    const response: AxiosResponse<{ roles: string[] }> = await this.api.get('/heroes/roles/list');
    return response.data.roles;
  }

  async getHeroesStats(): Promise<HeroesStats> {
    const response: AxiosResponse<HeroesStats> = await this.api.get('/heroes/stats/overview');
    return response.data;
  }

  // Guides API
  async getGuides(params?: {
    skip?: number;
    limit?: number;
    hero_id?: number;
    author_id?: number;
    difficulty?: string;
    play_style?: string;
    tags?: string;
  }): Promise<BuildGuide[]> {
    const response: AxiosResponse<BuildGuide[]> = await this.api.get('/guides', { params });
    return response.data;
  }

  async getGuide(id: number): Promise<BuildGuide> {
    const response: AxiosResponse<BuildGuide> = await this.api.get(`/guides/${id}`);
    return response.data;
  }

  async createGuide(guide: Partial<BuildGuide>): Promise<BuildGuide> {
    const response: AxiosResponse<BuildGuide> = await this.api.post('/guides', guide);
    return response.data;
  }

  async updateGuide(id: number, guide: Partial<BuildGuide>): Promise<BuildGuide> {
    const response: AxiosResponse<BuildGuide> = await this.api.put(`/guides/${id}`, guide);
    return response.data;
  }

  async deleteGuide(id: number): Promise<void> {
    await this.api.delete(`/guides/${id}`);
  }

  async rateGuide(id: number, rating: number, review?: string): Promise<void> {
    await this.api.post(`/guides/${id}/rate`, { rating, review });
  }

  async likeGuide(id: number): Promise<void> {
    await this.api.post(`/guides/${id}/like`);
  }

  async getGuideComments(id: number, params?: {
    skip?: number;
    limit?: number;
  }): Promise<Comment[]> {
    const response: AxiosResponse<Comment[]> = await this.api.get(`/guides/${id}/comments`, { params });
    return response.data;
  }

  async getTrendingGuides(params?: {
    skip?: number;
    limit?: number;
  }): Promise<BuildGuide[]> {
    const response: AxiosResponse<BuildGuide[]> = await this.api.get('/guides/trending', { params });
    return response.data;
  }

  async getLatestGuides(params?: {
    skip?: number;
    limit?: number;
  }): Promise<BuildGuide[]> {
    const response: AxiosResponse<BuildGuide[]> = await this.api.get('/guides/latest', { params });
    return response.data;
  }

  // Users API
  async getUsers(params?: {
    skip?: number;
    limit?: number;
  }): Promise<User[]> {
    const response: AxiosResponse<User[]> = await this.api.get('/users', { params });
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(`/users/${id}`, user);
    return response.data;
  }

  async getUserGuides(id: number, params?: {
    skip?: number;
    limit?: number;
  }): Promise<BuildGuide[]> {
    const response: AxiosResponse<BuildGuide[]> = await this.api.get(`/users/${id}/guides`, { params });
    return response.data;
  }

  async getUserStats(id: number): Promise<UserStats> {
    const response: AxiosResponse<UserStats> = await this.api.get(`/users/${id}/stats`);
    return response.data;
  }

  // Auth API
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/me');
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/refresh');
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
  }

  // News API
  async getNews(params?: {
    skip?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
  }): Promise<News[]> {
    const response: AxiosResponse<News[]> = await this.api.get('/news', { params });
    return response.data;
  }

  async getNewsItem(id: number): Promise<News> {
    const response: AxiosResponse<News> = await this.api.get(`/news/${id}`);
    return response.data;
  }

  async getFeaturedNews(params?: {
    limit?: number;
  }): Promise<News[]> {
    const response: AxiosResponse<News[]> = await this.api.get('/news/featured', { params });
    return response.data;
  }

  async getLatestNews(params?: {
    limit?: number;
  }): Promise<News[]> {
    const response: AxiosResponse<News[]> = await this.api.get('/news/latest', { params });
    return response.data;
  }

  async getNewsCategories(): Promise<string[]> {
    const response: AxiosResponse<{ categories: string[] }> = await this.api.get('/news/categories/list');
    return response.data.categories;
  }

  // Search API
  async search(query: string, type?: 'hero' | 'guide' | 'user', limit?: number): Promise<SearchResponse> {
    const response: AxiosResponse<SearchResponse> = await this.api.get('/search', {
      params: { q: query, type, limit }
    });
    return response.data;
  }

  async searchHeroes(query: string, params?: {
    role?: string;
    limit?: number;
  }): Promise<HeroSearchResponse> {
    const response: AxiosResponse<HeroSearchResponse> = await this.api.get('/search/heroes', {
      params: { q: query, ...params }
    });
    return response.data;
  }

  async searchGuides(query: string, params?: {
    hero_id?: number;
    difficulty?: string;
    play_style?: string;
    limit?: number;
  }): Promise<GuideSearchResponse> {
    const response: AxiosResponse<GuideSearchResponse> = await this.api.get('/search/guides', {
      params: { q: query, ...params }
    });
    return response.data;
  }

  async searchUsers(query: string, params?: {
    role?: string;
    limit?: number;
  }): Promise<UserSearchResponse> {
    const response: AxiosResponse<UserSearchResponse> = await this.api.get('/search/users', {
      params: { q: query, ...params }
    });
    return response.data;
  }

  async getSearchSuggestions(query: string, limit?: number): Promise<SearchSuggestionsResponse> {
    const response: AxiosResponse<SearchSuggestionsResponse> = await this.api.get('/search/suggestions', {
      params: { q: query, limit }
    });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<HealthCheckResponse> {
    const response: AxiosResponse<HealthCheckResponse> = await this.api.get('/api/health');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;