// Константы для приложения
export const APP_CONFIG = {
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_BASE: 2000, // базовая задержка в мс
  CACHE_REVALIDATE_TIME: 300, // 5 минут в секундах
  ARTICLES_PER_PAGE: 10,
} as const;

export const API_ENDPOINTS = {
  BASE_URL: "https://militaryfocus.ru/api",
  FEED: "/feed",
  ARTICLES: "/articles",
} as const;

export const UI_MESSAGES = {
  LOADING: "Загрузка новостей...",
  ERROR_TITLE: "⚠️ Ошибка загрузки",
  EMPTY_TITLE: "📰 Новостей пока нет",
  EMPTY_DESCRIPTION: "Попробуйте обновить страницу позже",
  RETRY_BUTTON: "Попробовать снова",
  RETRY_ATTEMPT: "Попытка",
  RETRY_OF: "из",
} as const;