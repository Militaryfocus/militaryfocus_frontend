import { useState, useEffect, useCallback } from 'react';
import { INews } from '@/types/news.types';
import { APP_CONFIG } from '@/constants/app.constants';
import { useSearchCache } from './useSearchCache';

export const useSearch = (articles: INews[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState<INews[]>(articles);
  const [isSearching, setIsSearching] = useState(false);
  const [cacheHit, setCacheHit] = useState(false);
  
  const { getCachedResults, setCachedResults } = useSearchCache();

  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setFilteredArticles(articles);
      setIsSearching(false);
      setCacheHit(false);
      return;
    }

    setIsSearching(true);
    
    // Проверяем кэш
    const cachedResults = getCachedResults(query);
    if (cachedResults) {
      setFilteredArticles(cachedResults);
      setIsSearching(false);
      setCacheHit(true);
      return;
    }

    // Выполняем поиск
    const filtered = articles.filter(article =>
      article.article_title.toLowerCase().includes(query.toLowerCase()) ||
      article.date.includes(query)
    );
    
    // Сохраняем в кэш
    setCachedResults(query, filtered);
    
    setFilteredArticles(filtered);
    setIsSearching(false);
    setCacheHit(false);
  }, [articles, getCachedResults, setCachedResults]);

  // Debounced search function
  const debouncedSearch = useCallback((query: string) => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, APP_CONFIG.SEARCH_DEBOUNCE_DELAY);
    
    return () => clearTimeout(timeoutId);
  }, [performSearch]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  }, [debouncedSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setFilteredArticles(articles);
    setIsSearching(false);
  }, [articles]);

  // Update filtered articles when articles change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles);
    } else {
      performSearch(searchQuery);
    }
  }, [articles, searchQuery, performSearch]);

  return {
    searchQuery,
    filteredArticles,
    isSearching,
    cacheHit,
    handleSearch,
    clearSearch,
    hasResults: filteredArticles.length > 0,
    resultCount: filteredArticles.length,
  };
};