"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchArticles } from "@/api/api/articles";
import Banner from "@/components/Banner/Banner";
import ContainerDefault from "@/components/Containers/ContainerDefault";
import NewsCard from "@/components/News/NewsCard";
import Pagination from "@/components/Pagination/Pagination";
import SkeletonCard from "@/components/Loading/SkeletonCard";
import SearchBar from "@/components/Search/SearchBar";
import FilterBar from "@/components/Filter/FilterBar";
import ThemeToggle from "@/components/Theme/ThemeToggle";
import ToastContainer from "@/components/Toast/ToastContainer";
import FavoriteButton from "@/components/Favorites/FavoriteButton";
import { INews, IApiResponse } from "@/types/news.types";
import { APP_CONFIG, UI_MESSAGES, FILTER_OPTIONS } from "@/constants/app.constants";
import { useToast } from "@/hooks/useToast";
import { useSearch } from "@/hooks/useSearch";

export default function Home() {
  const [apiData, setApiData] = useState<IApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  // Хуки для UX улучшений
  const { toasts, success, error: showError, removeToast } = useToast();
  const { 
    searchQuery, 
    filteredArticles, 
    isSearching, 
    handleSearch, 
    clearSearch,
    resultCount 
  } = useSearch(apiData?.articles || []);

  const loadArticles = useCallback(async (page: number, isRetry: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchArticles(page);
      setApiData(data);
      setCurrentPage(page);
      setRetryCount(0); // Сбрасываем счетчик при успешной загрузке
      
      // Показываем уведомление об успешной загрузке
      if (data.articles.length > 0) {
        success(`Загружено ${data.articles.length} новостей`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла неизвестная ошибка';
      setError(errorMessage);
      showError('Ошибка загрузки', errorMessage);
      
      if (!isRetry && retryCount < APP_CONFIG.RETRY_ATTEMPTS) {
        // Автоматический retry
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadArticles(page, true);
        }, APP_CONFIG.RETRY_DELAY_BASE * (retryCount + 1)); // Увеличиваем задержку с каждой попыткой
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount, success, showError]);

  useEffect(() => {
    loadArticles(1);
  }, [loadArticles]);

  const handlePageChange = (page: number) => {
    loadArticles(page);
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    // Здесь можно добавить логику фильтрации по категориям
    // Пока что просто меняем состояние
  };

  const handleFavoriteToggle = (news: INews, isFavorite: boolean) => {
    if (isFavorite) {
      success(UI_MESSAGES.ADDED_TO_FAVORITES);
    } else {
      success(UI_MESSAGES.REMOVED_FROM_FAVORITES);
    }
  };

  // Компонент состояния загрузки
  const LoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );

  // Компонент состояния ошибки
  const ErrorState = () => (
    <div className="text-center py-20">
      <div className="text-red-400 text-lg mb-4">{UI_MESSAGES.ERROR_TITLE}</div>
      <p className="text-gray-300 mb-6">{error}</p>
      {retryCount > 0 && retryCount < APP_CONFIG.RETRY_ATTEMPTS && (
        <p className="text-yellow-400 mb-4">
          {UI_MESSAGES.RETRY_ATTEMPT} {retryCount + 1} {UI_MESSAGES.RETRY_OF} {APP_CONFIG.RETRY_ATTEMPTS}...
        </p>
      )}
      <button 
        onClick={() => loadArticles(currentPage)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
      >
        {UI_MESSAGES.RETRY_BUTTON}
      </button>
    </div>
  );

  // Компонент пустого состояния
  const EmptyState = () => (
    <div className="text-center py-20">
      <div className="text-gray-400 text-lg mb-4">
        {searchQuery ? UI_MESSAGES.NO_RESULTS : UI_MESSAGES.EMPTY_TITLE}
      </div>
      <p className="text-gray-500">
        {searchQuery 
          ? `По запросу "${searchQuery}" ничего не найдено` 
          : UI_MESSAGES.EMPTY_DESCRIPTION
        }
      </p>
      {searchQuery && (
        <button 
          onClick={clearSearch}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Очистить поиск
        </button>
      )}
    </div>
  );

  return (
    <main className="pb-[100px] max-[425px]:pb-[80px]">
      <Banner title="Новости СВО" description="Последние новости СВО за 2025 год" />
      <ContainerDefault>
        {/* Хлебные крошки */}
        <div className="mb-[40px] max-[425px]:mb-[60px]">
          <div className="flex items-center gap-2 text-white mb-[20px] max-[425px]:hidden">
            <span>Главная</span>
            <span>/</span>
            <span>Новости</span>
          </div>
        </div>

        {/* Панель управления */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Поиск и фильтры */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 max-w-md">
                <SearchBar 
                  onSearch={handleSearch}
                  placeholder={UI_MESSAGES.SEARCH_PLACEHOLDER}
                />
              </div>
              <FilterBar
                filters={FILTER_OPTIONS}
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
              />
            </div>
            
            {/* Переключатель темы */}
            <ThemeToggle />
          </div>

          {/* Индикатор поиска */}
          {isSearching && (
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              Поиск...
            </div>
          )}

          {/* Результаты поиска */}
          {searchQuery && !isSearching && (
            <div className="text-sm text-gray-400">
              Найдено: {resultCount} {resultCount === 1 ? 'новость' : 'новостей'}
            </div>
          )}
        </div>

        {loading && <LoadingState />}
        
        {error && !loading && <ErrorState />}
        
        {!loading && !error && apiData && (
          <>
            {(searchQuery ? filteredArticles : apiData.articles).length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-[40px] md:mb-[60px]">
                  {(searchQuery ? filteredArticles : apiData.articles).map((news: INews) => (
                    <div key={news.id} className="relative group">
                      <NewsCard news={news} />
                      {/* Кнопка избранного */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <FavoriteButton 
                          news={news}
                          onToggle={handleFavoriteToggle}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Пагинация только если не активен поиск */}
                {!searchQuery && apiData.totalPages && apiData.totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={apiData.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </>
        )}
      </ContainerDefault>
      
      {/* Контейнер уведомлений */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </main>
  );
}
