// Конфигурация API для интеграции с бэкендом
export const API_CONFIG = {
  // Базовые настройки
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://militaryfocus.ru/api",
  VERSION: process.env.NEXT_PUBLIC_API_VERSION || "v1",
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000"),
  
  // Бэкенд URLs
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "https://militaryfocus.ru",
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || "wss://militaryfocus.ru/ws",
  
  // Аутентификация
  AUTH_ENABLED: process.env.NEXT_PUBLIC_AUTH_ENABLED === "true",
  AUTH_PROVIDER: process.env.NEXT_PUBLIC_AUTH_PROVIDER || "local",
  TOKEN_KEY: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || "military_focus_token",
  REFRESH_KEY: process.env.NEXT_PUBLIC_AUTH_REFRESH_KEY || "military_focus_refresh",
  
  // Функции
  COMMENTS_ENABLED: process.env.NEXT_PUBLIC_COMMENTS_ENABLED === "true",
  NOTIFICATIONS_ENABLED: process.env.NEXT_PUBLIC_NOTIFICATIONS_ENABLED === "true",
  REAL_TIME_ENABLED: process.env.NEXT_PUBLIC_REAL_TIME_ENABLED === "true",
  ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",
  
  // Разработка
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === "true",
  MOCK_API: process.env.NEXT_PUBLIC_MOCK_API === "true",
  
  // Безопасность
  CORS_ORIGIN: process.env.NEXT_PUBLIC_CORS_ORIGIN || "http://localhost:3000",
  SECURE_COOKIES: process.env.NEXT_PUBLIC_SECURE_COOKIES === "true",
  
  // Кэширование
  CACHE_TTL: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL || "300"),
  CACHE_MAX_SIZE: parseInt(process.env.NEXT_PUBLIC_CACHE_MAX_SIZE || "50"),
  
  // Загрузка файлов
  MAX_FILE_SIZE: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || "10485760"), // 10MB
  ALLOWED_FILE_TYPES: (process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || "image/jpeg,image/png,image/webp,image/gif").split(","),
  
  // Rate Limiting
  RATE_LIMIT_REQUESTS: parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_REQUESTS || "100"),
  RATE_LIMIT_WINDOW: parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_WINDOW || "900000"), // 15 минут
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Аутентификация
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  
  // Новости
  NEWS: {
    LIST: "/news",
    DETAIL: "/news/:id",
    CREATE: "/news",
    UPDATE: "/news/:id",
    DELETE: "/news/:id",
    SEARCH: "/news/search",
    CATEGORIES: "/news/categories",
    FEATURED: "/news/featured",
    POPULAR: "/news/popular",
    LATEST: "/news/latest",
  },
  
  // Комментарии
  COMMENTS: {
    LIST: "/comments",
    CREATE: "/comments",
    UPDATE: "/comments/:id",
    DELETE: "/comments/:id",
    LIKE: "/comments/:id/like",
    DISLIKE: "/comments/:id/dislike",
  },
  
  // Пользователи
  USERS: {
    PROFILE: "/users/profile",
    UPDATE: "/users/profile",
    AVATAR: "/users/avatar",
    PREFERENCES: "/users/preferences",
    FAVORITES: "/users/favorites",
    HISTORY: "/users/history",
  },
  
  // Уведомления
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: "/notifications/:id/read",
    MARK_ALL_READ: "/notifications/read-all",
    SETTINGS: "/notifications/settings",
  },
  
  // Аналитика
  ANALYTICS: {
    STATS: "/analytics/stats",
    EVENTS: "/analytics/events",
    USER_ACTIVITY: "/analytics/user-activity",
    POPULAR_CONTENT: "/analytics/popular-content",
  },
  
  // Загрузка файлов
  UPLOAD: {
    IMAGE: "/upload/image",
    AVATAR: "/upload/avatar",
    DOCUMENT: "/upload/document",
  },
  
  // Поиск
  SEARCH: {
    GLOBAL: "/search",
    SUGGESTIONS: "/search/suggestions",
    HISTORY: "/search/history",
    SAVE: "/search/save",
  },
  
  // WebSocket
  WS: {
    CONNECT: "/ws",
    NEWS_UPDATES: "/ws/news",
    COMMENTS_UPDATES: "/ws/comments",
    NOTIFICATIONS: "/ws/notifications",
  },
} as const;

// HTTP методы
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

// Статусы ответов
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Типы контента
export const CONTENT_TYPES = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data",
  URL_ENCODED: "application/x-www-form-urlencoded",
  TEXT: "text/plain",
  HTML: "text/html",
} as const;

// Заголовки по умолчанию
export const DEFAULT_HEADERS = {
  "Content-Type": CONTENT_TYPES.JSON,
  "Accept": CONTENT_TYPES.JSON,
  "User-Agent": "MilitaryFocus-Frontend/1.0",
  "X-Requested-With": "XMLHttpRequest",
} as const;

// Настройки кэширования
export const CACHE_CONFIG = {
  DEFAULT_TTL: API_CONFIG.CACHE_TTL,
  MAX_SIZE: API_CONFIG.CACHE_MAX_SIZE,
  STRATEGIES: {
    CACHE_FIRST: "cache-first",
    NETWORK_FIRST: "network-first",
    CACHE_ONLY: "cache-only",
    NETWORK_ONLY: "network-only",
  },
} as const;

// Настройки retry
export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  BASE_DELAY: 1000,
  MAX_DELAY: 10000,
  BACKOFF_FACTOR: 2,
  RETRYABLE_STATUSES: [
    HTTP_STATUS.SERVICE_UNAVAILABLE,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
  ],
} as const;