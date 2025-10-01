// Константы для приложения
export const APP_CONFIG = {
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_BASE: 2000, // базовая задержка в мс
  CACHE_REVALIDATE_TIME: 300, // 5 минут в секундах
  ARTICLES_PER_PAGE: 10,
  SEARCH_DEBOUNCE_DELAY: 300, // задержка поиска в мс
  TOAST_DURATION: 5000, // длительность уведомлений в мс
  ANIMATION_DURATION: 200, // длительность анимаций в мс
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
  SEARCH_PLACEHOLDER: "Поиск новостей...",
  NO_RESULTS: "Ничего не найдено",
  ADDED_TO_FAVORITES: "Добавлено в избранное",
  REMOVED_FROM_FAVORITES: "Удалено из избранного",
} as const;

export const FILTER_OPTIONS = [
  { id: 'all', label: 'Все новости', value: 'all' },
  { id: 'svo', label: 'СВО', value: 'svo' },
  { id: 'weapons', label: 'Вооружение', value: 'weapons' },
  { id: 'analytics', label: 'Аналитика', value: 'analytics' },
  { id: 'history', label: 'История', value: 'history' },
  { id: 'technology', label: 'Технологии', value: 'technology' },
];