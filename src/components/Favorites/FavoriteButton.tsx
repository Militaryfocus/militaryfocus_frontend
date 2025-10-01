"use client";

import { useState, useEffect } from 'react';
import { FiHeart, FiBookmark } from 'react-icons/fi';
import { INews } from '@/types/news.types';

interface FavoriteButtonProps {
  news: INews;
  type?: 'heart' | 'bookmark';
  className?: string;
  onToggle?: (news: INews, isFavorite: boolean) => void;
}

export default function FavoriteButton({ 
  news, 
  type = 'heart', 
  className = "",
  onToggle 
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Проверяем, есть ли новость в избранном
    const favorites = getFavorites();
    setIsFavorite(favorites.some(fav => fav.id === news.id));
  }, [news.id]);

  const getFavorites = (): INews[] => {
    try {
      const stored = localStorage.getItem('favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveFavorites = (favorites: INews[]) => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Ошибка сохранения избранного:', error);
    }
  };

  const handleToggle = () => {
    const favorites = getFavorites();
    let newFavorites: INews[];
    let newIsFavorite: boolean;

    if (isFavorite) {
      // Удаляем из избранного
      newFavorites = favorites.filter(fav => fav.id !== news.id);
      newIsFavorite = false;
    } else {
      // Добавляем в избранное
      newFavorites = [...favorites, news];
      newIsFavorite = true;
    }

    saveFavorites(newFavorites);
    setIsFavorite(newIsFavorite);
    
    // Вызываем callback если передан
    onToggle?.(news, newIsFavorite);
  };

  const Icon = type === 'heart' ? FiHeart : FiBookmark;

  return (
    <button
      onClick={handleToggle}
      className={`
        p-2 rounded-full transition-all duration-200
        hover:scale-110 active:scale-95
        ${isFavorite 
          ? 'text-red-500 bg-red-500/20 hover:bg-red-500/30' 
          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
        }
        ${className}
      `}
      aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
      title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <Icon className={`h-4 w-4 transition-all duration-200 ${
        isFavorite ? 'fill-current' : ''
      }`} />
    </button>
  );
}

// Хук для работы с избранным
export const useFavorites = () => {
  const getFavorites = (): INews[] => {
    try {
      const stored = localStorage.getItem('favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const addToFavorites = (news: INews) => {
    const favorites = getFavorites();
    if (!favorites.some(fav => fav.id === news.id)) {
      const newFavorites = [...favorites, news];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  };

  const removeFromFavorites = (newsId: number) => {
    const favorites = getFavorites();
    const newFavorites = favorites.filter(fav => fav.id !== newsId);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (newsId: number): boolean => {
    const favorites = getFavorites();
    return favorites.some(fav => fav.id === newsId);
  };

  const clearFavorites = () => {
    localStorage.removeItem('favorites');
  };

  return {
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
  };
};