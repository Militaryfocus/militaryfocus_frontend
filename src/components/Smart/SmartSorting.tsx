"use client";

import { useState, useCallback, useEffect } from 'react';
import { FiTrendingUp, FiClock, FiStar, FiEye, FiMessageCircle } from 'react-icons/fi';
import { INews } from '@/types/news.types';

interface SmartSortingProps {
  articles: INews[];
  onSort: (sortedArticles: INews[]) => void;
  className?: string;
}

type SortOption = 'relevance' | 'trending' | 'recent' | 'popular' | 'recommended';

interface SortOptionConfig {
  id: SortOption;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const SORT_OPTIONS: SortOptionConfig[] = [
  {
    id: 'recommended',
    label: 'Рекомендуемые',
    icon: <FiStar className="h-4 w-4" />,
    description: 'Персонализированные рекомендации'
  },
  {
    id: 'trending',
    label: 'Трендовые',
    icon: <FiTrendingUp className="h-4 w-4" />,
    description: 'Самые обсуждаемые новости'
  },
  {
    id: 'recent',
    label: 'Свежие',
    icon: <FiClock className="h-4 w-4" />,
    description: 'Последние опубликованные'
  },
  {
    id: 'popular',
    label: 'Популярные',
    icon: <FiEye className="h-4 w-4" />,
    description: 'Самые просматриваемые'
  },
  {
    id: 'relevance',
    label: 'По релевантности',
    icon: <FiMessageCircle className="h-4 w-4" />,
    description: 'Наиболее подходящие'
  }
];

export default function SmartSorting({ articles, onSort, className = "" }: SmartSortingProps) {
  const [activeSort, setActiveSort] = useState<SortOption>('recommended');
  const [userPreferences, setUserPreferences] = useState<{
    favoriteCategories: string[];
    readingHistory: number[];
    timePreferences: 'morning' | 'afternoon' | 'evening';
  }>({
    favoriteCategories: [],
    readingHistory: [],
    timePreferences: 'morning'
  });

  // Загружаем предпочтения пользователя
  useEffect(() => {
    try {
      const stored = localStorage.getItem('userReadingPreferences');
      if (stored) {
        setUserPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Ошибка загрузки предпочтений:', error);
    }
  }, []);

  // Сохраняем предпочтения
  useEffect(() => {
    localStorage.setItem('userReadingPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  const calculateRelevanceScore = useCallback((article: INews) => {
    let score = 0;
    
    // Бонус за избранное
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favorites.some((fav: INews) => fav.id === article.id)) {
      score += 50;
    }
    
    // Бонус за категорию
    if (userPreferences.favoriteCategories.some(cat => 
      article.article_title.toLowerCase().includes(cat.toLowerCase())
    )) {
      score += 30;
    }
    
    // Бонус за время публикации (свежие новости)
    const articleDate = new Date(article.date);
    const now = new Date();
    const hoursDiff = (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff < 24) score += 20;
    else if (hoursDiff < 168) score += 10; // неделя
    
    return score;
  }, [userPreferences]);

  const calculateTrendingScore = useCallback((article: INews) => {
    // Простая эмуляция трендовости на основе заголовка
    const trendingKeywords = ['сво', 'специальная операция', 'украина', 'россия', 'военные'];
    const title = article.article_title.toLowerCase();
    
    let score = 0;
    trendingKeywords.forEach(keyword => {
      if (title.includes(keyword)) {
        score += 20;
      }
    });
    
    return score;
  }, []);

  const sortArticles = useCallback((sortType: SortOption) => {
    const sortedArticles = [...articles];
    
    switch (sortType) {
      case 'recommended':
        sortedArticles.sort((a, b) => {
          const scoreA = calculateRelevanceScore(a);
          const scoreB = calculateRelevanceScore(b);
          return scoreB - scoreA;
        });
        break;
        
      case 'trending':
        sortedArticles.sort((a, b) => {
          const scoreA = calculateTrendingScore(a);
          const scoreB = calculateTrendingScore(b);
          return scoreB - scoreA;
        });
        break;
        
      case 'recent':
        sortedArticles.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
        break;
        
      case 'popular':
        // Эмуляция популярности на основе длины заголовка (как пример)
        sortedArticles.sort((a, b) => {
          const popularityA = a.article_title.length + Math.random() * 100;
          const popularityB = b.article_title.length + Math.random() * 100;
          return popularityB - popularityA;
        });
        break;
        
      case 'relevance':
        sortedArticles.sort((a, b) => {
          const scoreA = calculateRelevanceScore(a);
          const scoreB = calculateRelevanceScore(b);
          return scoreB - scoreA;
        });
        break;
    }
    
    onSort(sortedArticles);
  }, [articles, onSort, calculateRelevanceScore, calculateTrendingScore]);

  const handleSortChange = useCallback((sortType: SortOption) => {
    setActiveSort(sortType);
    sortArticles(sortType);
  }, [sortArticles]);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-gray-300">Сортировка:</span>
        <div className="flex gap-1 flex-wrap">
          {SORT_OPTIONS.map(option => (
            <button
              key={option.id}
              onClick={() => handleSortChange(option.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                activeSort === option.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
              title={option.description}
            >
              {option.icon}
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Индикатор активной сортировки */}
      <div className="text-xs text-gray-500">
        {SORT_OPTIONS.find(opt => opt.id === activeSort)?.description}
      </div>
    </div>
  );
}

// Компонент для рекомендаций
interface RecommendationsProps {
  articles: INews[];
  className?: string;
}

export function Recommendations({ articles, className = "" }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<INews[]>([]);

  useEffect(() => {
    // Простой алгоритм рекомендаций
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favoriteCategories = favorites.map((fav: INews) => 
      fav.article_title.split(' ')[0].toLowerCase()
    );
    
    const recommended = articles
      .filter(article => 
        favoriteCategories.some((cat: string) => 
          article.article_title.toLowerCase().includes(cat)
        )
      )
      .slice(0, 3);
    
    setRecommendations(recommended);
  }, [articles]);

  if (recommendations.length === 0) return null;

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <FiStar className="h-5 w-5 text-yellow-400" />
        Рекомендуем прочитать
      </h3>
      
      <div className="space-y-3">
        {recommendations.map((article, index) => (
          <div key={article.id} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white mb-1 line-clamp-2">
                {article.article_title}
              </h4>
              <p className="text-xs text-gray-400">{article.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Хук для анализа чтения пользователя
export const useReadingAnalytics = () => {
  const trackReading = useCallback((articleId: number, timeSpent: number) => {
    try {
      const analytics = JSON.parse(localStorage.getItem('readingAnalytics') || '{}');
      if (!analytics[articleId]) {
        analytics[articleId] = { views: 0, totalTime: 0 };
      }
      analytics[articleId].views += 1;
      analytics[articleId].totalTime += timeSpent;
      localStorage.setItem('readingAnalytics', JSON.stringify(analytics));
    } catch (error) {
      console.error('Ошибка сохранения аналитики:', error);
    }
  }, []);

  const getReadingStats = useCallback(() => {
    try {
      const analytics = JSON.parse(localStorage.getItem('readingAnalytics') || '{}');
      return analytics;
    } catch (error) {
      console.error('Ошибка загрузки аналитики:', error);
      return {};
    }
  }, []);

  return {
    trackReading,
    getReadingStats,
  };
};