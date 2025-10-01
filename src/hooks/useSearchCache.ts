import { useState, useCallback, useEffect } from 'react';
import { INews } from '@/types/news.types';

interface CacheEntry {
  query: string;
  results: INews[];
  timestamp: number;
  expiresAt: number;
}

interface SearchCache {
  [key: string]: CacheEntry;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 минут
const MAX_CACHE_SIZE = 50; // Максимум 50 записей в кэше

export const useSearchCache = () => {
  const [cache, setCache] = useState<SearchCache>({});

  // Загружаем кэш из localStorage при инициализации
  useEffect(() => {
    try {
      const storedCache = localStorage.getItem('searchCache');
      if (storedCache) {
        const parsedCache = JSON.parse(storedCache);
        // Очищаем просроченные записи
        const cleanedCache = Object.fromEntries(
          Object.entries(parsedCache).filter(([, entry]: [string, any]) => 
            entry.expiresAt > Date.now()
          )
        ) as SearchCache;
        setCache(cleanedCache);
      }
    } catch (error) {
      console.error('Ошибка загрузки кэша поиска:', error);
    }
  }, []);

  // Сохраняем кэш в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem('searchCache', JSON.stringify(cache));
    } catch (error) {
      console.error('Ошибка сохранения кэша поиска:', error);
    }
  }, [cache]);

  const getCachedResults = useCallback((query: string): INews[] | null => {
    const normalizedQuery = query.toLowerCase().trim();
    const entry = cache[normalizedQuery];
    
    if (entry && entry.expiresAt > Date.now()) {
      return entry.results;
    }
    
    return null;
  }, [cache]);

  const setCachedResults = useCallback((query: string, results: INews[]) => {
    const normalizedQuery = query.toLowerCase().trim();
    const now = Date.now();
    
    const newEntry: CacheEntry = {
      query: normalizedQuery,
      results,
      timestamp: now,
      expiresAt: now + CACHE_DURATION,
    };

    setCache(prevCache => {
      const newCache = { ...prevCache, [normalizedQuery]: newEntry };
      
      // Ограничиваем размер кэша
      const entries = Object.entries(newCache);
      if (entries.length > MAX_CACHE_SIZE) {
        // Удаляем самые старые записи
        const sortedEntries = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        const entriesToKeep = sortedEntries.slice(-MAX_CACHE_SIZE);
        return Object.fromEntries(entriesToKeep);
      }
      
      return newCache;
    });
  }, []);

  const clearCache = useCallback(() => {
    setCache({});
    localStorage.removeItem('searchCache');
  }, []);

  const getCacheStats = useCallback(() => {
    const entries = Object.values(cache);
    const validEntries = entries.filter(entry => entry.expiresAt > Date.now());
    
    return {
      totalEntries: entries.length,
      validEntries: validEntries.length,
      expiredEntries: entries.length - validEntries.length,
      cacheSize: JSON.stringify(cache).length,
    };
  }, [cache]);

  return {
    getCachedResults,
    setCachedResults,
    clearCache,
    getCacheStats,
  };
};