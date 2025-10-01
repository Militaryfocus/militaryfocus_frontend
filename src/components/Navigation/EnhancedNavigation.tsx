"use client";

import { useState } from 'react';
import { FiChevronRight, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Хлебные крошки">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <FiChevronRight className="h-4 w-4 text-gray-500 mx-2" />
          )}
          
          {item.href ? (
            <a
              href={item.href}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ) : (
            <span className="flex items-center gap-1 text-white">
              {item.icon}
              <span>{item.label}</span>
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

// Компонент для навигации по страницам
interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showQuickJump?: boolean;
  className?: string;
}

export function PageNavigation({
  currentPage,
  totalPages,
  onPageChange,
  showQuickJump = true,
  className = ""
}: PageNavigationProps) {
  const [quickJumpPage, setQuickJumpPage] = useState('');

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handleQuickJump = () => {
    const page = parseInt(quickJumpPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setQuickJumpPage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickJump();
    }
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Информация о страницах */}
      <div className="text-sm text-gray-400">
        Страница {currentPage} из {totalPages}
      </div>

      {/* Навигация */}
      <div className="flex items-center gap-2">
        {/* Предыдущая страница */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Назад</span>
        </button>

        {/* Номера страниц */}
        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : page === '...'
                  ? 'text-gray-500 cursor-default'
                  : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Следующая страница */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Вперед</span>
          <FiArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Быстрый переход */}
      {showQuickJump && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Перейти к:</span>
          <input
            type="number"
            value={quickJumpPage}
            onChange={(e) => setQuickJumpPage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="№"
            min="1"
            max={totalPages}
            className="w-16 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleQuickJump}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}

// Компонент для навигации по категориям
interface CategoryNavigationProps {
  categories: Array<{
    id: string;
    label: string;
    count?: number;
    icon?: React.ReactNode;
  }>;
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

export function CategoryNavigation({
  categories,
  activeCategory,
  onCategoryChange,
  className = ""
}: CategoryNavigationProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeCategory === category.id
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {category.icon}
          <span>{category.label}</span>
          {category.count !== undefined && (
            <span className={`px-2 py-1 rounded-full text-xs ${
              activeCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}>
              {category.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Компонент для навигации по истории
interface HistoryNavigationProps {
  onBack: () => void;
  onForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  className?: string;
}

export function HistoryNavigation({
  onBack,
  onForward,
  canGoBack,
  canGoForward,
  className = ""
}: HistoryNavigationProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Назад"
      >
        <FiArrowLeft className="h-4 w-4" />
      </button>
      
      <button
        onClick={onForward}
        disabled={!canGoForward}
        className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Вперед"
      >
        <FiArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// Хук для управления историей навигации
export const useNavigationHistory = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const push = (path: string) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      return history[currentIndex - 1];
    }
    return null;
  };

  const goForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return history[currentIndex + 1];
    }
    return null;
  };

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  return {
    history,
    currentIndex,
    push,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
  };
};