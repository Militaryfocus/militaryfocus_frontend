import { API_CONFIG, API_ENDPOINTS, HTTP_METHODS, HTTP_STATUS, DEFAULT_HEADERS, RETRY_CONFIG } from '@/config/api.config';

// Типы для API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
  errors?: string[];
  code?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Класс для ошибок API
export class ApiError extends Error {
  status: number;
  code?: string;
  details?: any;

  constructor({ message, status, code, details }: { message: string; status: number; code?: string; details?: any }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  signal?: AbortSignal;
}

// Класс для работы с API
export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = { ...DEFAULT_HEADERS };
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Установка токена авторизации
  setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  // Получение токена из localStorage
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(API_CONFIG.TOKEN_KEY);
  }

  // Создание URL с параметрами
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    let url = `${this.baseURL}${endpoint}`;
    
    // Замена параметров в пути (:id, :slug и т.д.)
    if (params) {
      Object.keys(params).forEach(key => {
        if (url.includes(`:${key}`)) {
          url = url.replace(`:${key}`, encodeURIComponent(params[key]));
          delete params[key];
        }
      });
    }

    // Добавление query параметров
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }

    return url;
  }

  // Retry логика
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    attempts: number = RETRY_CONFIG.MAX_ATTEMPTS
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error: any) {
      if (attempts > 0 && this.isRetryableError(error)) {
        const delay = Math.min(
          RETRY_CONFIG.BASE_DELAY * Math.pow(RETRY_CONFIG.BACKOFF_FACTOR, RETRY_CONFIG.MAX_ATTEMPTS - attempts),
          RETRY_CONFIG.MAX_DELAY
        );
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(requestFn, attempts - 1);
      }
      throw error;
    }
  }

  // Проверка, можно ли повторить запрос
  private isRetryableError(error: any): boolean {
    return (
      error.status >= 500 ||
      error.status === HTTP_STATUS.TOO_MANY_REQUESTS ||
      error.name === 'NetworkError' ||
      error.name === 'TimeoutError'
    );
  }

  // Основной метод для выполнения запросов
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = HTTP_METHODS.GET,
      headers = {},
      body,
      timeout = this.timeout,
      retries = RETRY_CONFIG.MAX_ATTEMPTS,
      signal,
    } = config;

    // Добавляем токен авторизации
    const authToken = this.getAuthToken();
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      signal: signal || AbortSignal.timeout(timeout),
    };

    // Добавляем body для POST/PUT/PATCH запросов
    if (body && method !== HTTP_METHODS.GET) {
      if (body instanceof FormData) {
        delete requestHeaders['Content-Type']; // Браузер установит автоматически
        requestConfig.body = body;
      } else {
        requestConfig.body = JSON.stringify(body);
      }
    }

    const url = this.buildURL(endpoint);

    if (API_CONFIG.DEBUG_MODE) {
      console.log(`API Request: ${method} ${url}`, { headers: requestHeaders, body });
    }

    const requestFn = async () => {
      const response = await fetch(url, requestConfig);
      
      if (API_CONFIG.DEBUG_MODE) {
        console.log(`API Response: ${response.status} ${response.statusText}`);
      }

      // Обработка ошибок HTTP
      if (!response.ok) {
        const errorData = await this.parseResponse(response);
        throw new ApiError({
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          code: errorData.code,
          details: errorData,
        });
      }

      return this.parseResponse(response);
    };

    try {
      return await this.retryRequest(requestFn, retries);
    } catch (error: any) {
      if (API_CONFIG.DEBUG_MODE) {
        console.error('API Error:', error);
      }
      throw error;
    }
  }

  // Парсинг ответа
  private async parseResponse(response: Response): Promise<ApiResponse> {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      return {
        data: text,
        status: response.status,
        success: response.ok,
      };
    }
  }

  // Публичные методы для различных типов запросов
  async get<T>(endpoint: string, params?: Record<string, any>, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: HTTP_METHODS.GET });
  }

  async post<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: HTTP_METHODS.POST, body });
  }

  async put<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: HTTP_METHODS.PUT, body });
  }

  async patch<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: HTTP_METHODS.PATCH, body });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: HTTP_METHODS.DELETE });
  }

  // Загрузка файлов
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    return this.request<T>(endpoint, {
      method: HTTP_METHODS.POST,
      body: formData,
      headers: {}, // Убираем Content-Type для FormData
    });
  }

  // WebSocket подключение
  connectWebSocket(endpoint: string): WebSocket {
    const wsUrl = `${API_CONFIG.WS_URL}${endpoint}`;
    const authToken = this.getAuthToken();
    
    const url = authToken ? `${wsUrl}?token=${authToken}` : wsUrl;
    return new WebSocket(url);
  }
}

// Создаем экземпляр API клиента
export const apiClient = new ApiClient();

// Экспортируем константы для удобства
export { API_ENDPOINTS, HTTP_METHODS, HTTP_STATUS };