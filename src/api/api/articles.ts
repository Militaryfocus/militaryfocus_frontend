import { INews, IApiResponse, IArticleData } from '@/types/news.types'
import { mockNewsData } from '@/data/news.data'
import { API_ENDPOINTS, APP_CONFIG } from '@/constants/app.constants'

export const BASE_URL = API_ENDPOINTS.BASE_URL; 

// Получение списка статей
export async function fetchArticles(page: number = 1): Promise<IApiResponse> {
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.FEED}?page=${page}`, {
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://militaryfocus.ru",
      },
      // Добавляем кэширование
      next: { revalidate: APP_CONFIG.CACHE_REVALIDATE_TIME }
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка при получении статей: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Нормализуем данные, добавляя поле image из article_image
    const normalizedArticles = data.articles?.map((article: any) => ({
      ...article,
      image: article.article_image
    })) || [];
    
    return {
      articles: normalizedArticles,
      totalPages: data.totalPages || Math.ceil(normalizedArticles.length / APP_CONFIG.ARTICLES_PER_PAGE),
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

// Создание статьи
export async function createArticle(data: IArticleData): Promise<INews> {
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ARTICLES}/`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Origin": "https://militaryfocus.ru",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка при создании статьи: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при создании статьи:', error);
    throw error;
  }
}

// Обновление статьи
export async function updateArticle(id: number, data: Partial<IArticleData>): Promise<INews> {
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ARTICLES}/${id}/`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Origin": "https://militaryfocus.ru",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка при обновлении статьи: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при обновлении статьи:', error);
    throw error;
  }
}

// Удаление статьи
export async function deleteArticle(id: number): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ARTICLES}/${id}/`, {
      method: "DELETE",
      headers: {
        "Origin": "https://militaryfocus.ru",
      },
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка при удалении статьи: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Ошибка при удалении статьи:', error);
    throw error;
  }
}
