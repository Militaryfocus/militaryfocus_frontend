import { INews, IApiResponse, IArticleData } from '@/types/news.types'
import { mockNewsData } from '@/data/news.data'
import { API_ENDPOINTS, APP_CONFIG } from '@/constants/app.constants'

export const BASE_URL = API_ENDPOINTS.BASE_URL; 

// Валидация данных статьи
const validateArticleData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  // Проверяем обязательные поля
  const requiredFields = ['article_title', 'article_image', 'article_link', 'date'];
  for (const field of requiredFields) {
    if (!data[field] || typeof data[field] !== 'string') {
      return false;
    }
  }
  
  // Проверяем длину строк
  if (data.article_title.length > 200) return false;
  if (data.article_link.length > 500) return false;
  
  // Проверяем формат даты
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(data.date)) return false;
  
  return true;
};

// Санитизация данных
const sanitizeArticleData = (data: any): INews => {
  return {
    id: parseInt(data.id) || 0,
    article_title: data.article_title.trim().substring(0, 200),
    article_image: data.article_image.trim().substring(0, 500),
    article_link: data.article_link.trim().substring(0, 500),
    date: data.date.trim(),
    image: data.article_image.trim().substring(0, 500)
  };
};

// Получение списка статей с улучшенной безопасностью
export async function fetchArticles(page: number = 1): Promise<IApiResponse> {
  // Валидация входных параметров
  if (!Number.isInteger(page) || page < 1) {
    throw new Error('Некорректный номер страницы');
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд таймаут
    
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.FEED}?page=${page}`, {
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://militaryfocus.ru",
        "User-Agent": "MilitaryFocus/1.0",
      },
      signal: controller.signal,
      // Добавляем кэширование
      next: { revalidate: APP_CONFIG.CACHE_REVALIDATE_TIME }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Ошибка при получении статей: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Валидация ответа API
    if (!data || !Array.isArray(data.articles)) {
      throw new Error('Некорректный формат ответа API');
    }
    
    // Нормализуем и валидируем данные
    const normalizedArticles = data.articles
      .filter(validateArticleData)
      .map(sanitizeArticleData);
    
    return {
      articles: normalizedArticles,
      totalPages: Math.max(1, data.totalPages || Math.ceil(normalizedArticles.length / APP_CONFIG.ARTICLES_PER_PAGE)),
      currentPage: page
    };
  } catch (error) {
    console.error('Ошибка при загрузке статей:', error);
    
    // Fallback на mock данные если API недоступен
    console.log('Используем mock данные для разработки');
    const startIndex = (page - 1) * APP_CONFIG.ARTICLES_PER_PAGE;
    const endIndex = startIndex + APP_CONFIG.ARTICLES_PER_PAGE;
    const paginatedArticles = mockNewsData.slice(startIndex, endIndex);
    
    return {
      articles: paginatedArticles,
      totalPages: Math.ceil(mockNewsData.length / APP_CONFIG.ARTICLES_PER_PAGE),
      currentPage: page
    };
  }
}

// Создание статьи с валидацией
export async function createArticle(data: IArticleData): Promise<INews> {
  // Валидация входных данных
  if (!data || typeof data !== 'object') {
    throw new Error('Некорректные данные статьи');
  }
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    throw new Error('Заголовок статьи обязателен');
  }
  
  if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
    throw new Error('Содержимое статьи обязательно');
  }
  
  // Санитизация данных
  const sanitizedData = {
    title: data.title.trim().substring(0, 200),
    content: data.content.trim().substring(0, 10000)
  };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ARTICLES}/`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Origin": "https://militaryfocus.ru",
        "User-Agent": "MilitaryFocus/1.0",
      },
      body: JSON.stringify(sanitizedData),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Ошибка при создании статьи: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Валидация ответа
    if (!validateArticleData(result)) {
      throw new Error('Некорректный формат созданной статьи');
    }
    
    return sanitizeArticleData(result);
  } catch (error) {
    console.error('Ошибка при создании статьи:', error);
    throw error;
  }
}

// Обновление статьи с валидацией
export async function updateArticle(id: number, data: Partial<IArticleData>): Promise<INews> {
  // Валидация ID
  if (!Number.isInteger(id) || id < 1) {
    throw new Error('Некорректный ID статьи');
  }
  
  // Валидация данных
  if (!data || typeof data !== 'object') {
    throw new Error('Некорректные данные для обновления');
  }
  
  // Санитизация данных
  const sanitizedData: Partial<IArticleData> = {};
  if (data.title) {
    sanitizedData.title = data.title.trim().substring(0, 200);
  }
  if (data.content) {
    sanitizedData.content = data.content.trim().substring(0, 10000);
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ARTICLES}/${id}/`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Origin": "https://militaryfocus.ru",
        "User-Agent": "MilitaryFocus/1.0",
      },
      body: JSON.stringify(sanitizedData),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Ошибка при обновлении статьи: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Валидация ответа
    if (!validateArticleData(result)) {
      throw new Error('Некорректный формат обновленной статьи');
    }
    
    return sanitizeArticleData(result);
  } catch (error) {
    console.error('Ошибка при обновлении статьи:', error);
    throw error;
  }
}

// Удаление статьи с валидацией
export async function deleteArticle(id: number): Promise<void> {
  // Валидация ID
  if (!Number.isInteger(id) || id < 1) {
    throw new Error('Некорректный ID статьи');
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ARTICLES}/${id}/`, {
      method: "DELETE",
      headers: {
        "Origin": "https://militaryfocus.ru",
        "User-Agent": "MilitaryFocus/1.0",
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Ошибка при удалении статьи: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Ошибка при удалении статьи:', error);
    throw error;
  }
}
