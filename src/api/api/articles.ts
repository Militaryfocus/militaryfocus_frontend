import { newsService } from '../services';
import { mockNewsData } from '@/data/news.data';
import { APP_CONFIG } from '@/constants/app.constants';

// Обновленная функция для получения статей с интеграцией с бэкендом
export async function fetchArticles(page: number = 1): Promise<any> {
  // Валидация входных параметров
  if (!Number.isInteger(page) || page < 1) {
    throw new Error('Некорректный номер страницы');
  }

  try {
    // Пытаемся получить данные с бэкенда
    const response = await newsService.getNews({
      page,
      limit: APP_CONFIG.ARTICLES_PER_PAGE,
      sort: 'newest'
    });

    if (response.success && response.data) {
      // Преобразуем данные в формат, ожидаемый фронтендом
      const articles = response.data.articles.map(article => ({
        id: article.id,
        article_title: article.title,
        article_image: article.image,
        article_link: `/news/${article.slug}`,
        date: article.publishedAt.split('T')[0], // Извлекаем только дату
        image: article.image
      }));

      return {
        articles,
        totalPages: response.data.pagination.totalPages,
        currentPage: page
      };
    }

    throw new Error('Некорректный формат ответа API');
  } catch (error) {
    console.error('Ошибка при загрузке статей с бэкенда:', error);
    
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

// Поиск статей с интеграцией с бэкендом
export async function searchArticles(query: string, page: number = 1): Promise<any> {
  try {
    const response = await newsService.searchNews(query, {
      page,
      limit: APP_CONFIG.ARTICLES_PER_PAGE,
      sort: 'newest'
    });

    if (response.success && response.data) {
      const articles = response.data.articles.map(article => ({
        id: article.id,
        article_title: article.title,
        article_image: article.image,
        article_link: `/news/${article.slug}`,
        date: article.publishedAt.split('T')[0],
        image: article.image
      }));

      return {
        articles,
        totalPages: response.data.pagination.totalPages,
        currentPage: page
      };
    }

    throw new Error('Некорректный формат ответа API');
  } catch (error) {
    console.error('Ошибка при поиске статей:', error);
    
    // Fallback на локальный поиск по mock данным
    const filteredArticles = mockNewsData.filter(article =>
      article.article_title.toLowerCase().includes(query.toLowerCase())
    );
    
    const startIndex = (page - 1) * APP_CONFIG.ARTICLES_PER_PAGE;
    const endIndex = startIndex + APP_CONFIG.ARTICLES_PER_PAGE;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
    
    return {
      articles: paginatedArticles,
      totalPages: Math.ceil(filteredArticles.length / APP_CONFIG.ARTICLES_PER_PAGE),
      currentPage: page
    };
  }
}

// Получение популярных статей
export async function getPopularArticles(limit: number = 10): Promise<any> {
  try {
    const response = await newsService.getPopularNews(limit);
    
    if (response.success && response.data) {
      return response.data.map(article => ({
        id: article.id,
        article_title: article.title,
        article_image: article.image,
        article_link: `/news/${article.slug}`,
        date: article.publishedAt.split('T')[0],
        image: article.image,
        views: article.views,
        likes: article.likes
      }));
    }
    
    throw new Error('Некорректный формат ответа API');
  } catch (error) {
    console.error('Ошибка при получении популярных статей:', error);
    
    // Fallback на mock данные
    return mockNewsData.slice(0, limit);
  }
}

// Получение рекомендуемых статей
export async function getFeaturedArticles(limit: number = 5): Promise<any> {
  try {
    const response = await newsService.getFeaturedNews(limit);
    
    if (response.success && response.data) {
      return response.data.map(article => ({
        id: article.id,
        article_title: article.title,
        article_image: article.image,
        article_link: `/news/${article.slug}`,
        date: article.publishedAt.split('T')[0],
        image: article.image,
        isFeatured: article.isFeatured
      }));
    }
    
    throw new Error('Некорректный формат ответа API');
  } catch (error) {
    console.error('Ошибка при получении рекомендуемых статей:', error);
    
    // Fallback на mock данные
    return mockNewsData.slice(0, limit);
  }
}
