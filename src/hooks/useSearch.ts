import { useState, useEffect, useCallback } from 'react';
import { INews } from '@/types/news.types';
import { APP_CONFIG } from '@/constants/app.constants';

export const useSearch = (articles: INews[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState<INews[]>(articles);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setFilteredArticles(articles);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    const filtered = articles.filter(article =>
      article.article_title.toLowerCase().includes(query.toLowerCase()) ||
      article.date.includes(query)
    );
    
    setFilteredArticles(filtered);
    setIsSearching(false);
  }, [articles]);

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
    handleSearch,
    clearSearch,
    hasResults: filteredArticles.length > 0,
    resultCount: filteredArticles.length,
  };
};