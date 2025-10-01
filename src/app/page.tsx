"use client";

import { useEffect, useState, useCallback } from "react";
import { FiSettings } from "react-icons/fi";
import { fetchArticles } from "@/api/api/articles";
import Banner from "@/components/Banner/Banner";
import ContainerDefault from "@/components/Containers/ContainerDefault";
import NewsCard from "@/components/News/NewsCard";
import Pagination from "@/components/Pagination/Pagination";
import SearchBar from "@/components/Search/SearchBar";
import FilterBar from "@/components/Filter/FilterBar";
import ThemeToggle from "@/components/Theme/ThemeToggle";
import ToastContainer from "@/components/Toast/ToastContainer";
import FavoriteButton from "@/components/Favorites/FavoriteButton";
import SettingsModal from "@/components/Settings/SettingsModal";
import VoiceSearch from "@/components/VoiceSearch/VoiceSearch";
import ExportFavorites from "@/components/Export/ExportFavorites";
import { INews, IApiResponse } from "@/types/news.types";
import { APP_CONFIG, UI_MESSAGES, FILTER_OPTIONS } from "@/constants/app.constants";
import { useToast } from "@/hooks/useToast";
import { useSearch } from "@/hooks/useSearch";
import PerformanceMonitor from "@/components/PerformanceMonitor/PerformanceMonitor";
import ErrorMonitor from "@/components/ErrorMonitor/ErrorMonitor";
import AccessibilityChecker from "@/components/AccessibilityChecker/AccessibilityChecker";
import PWAInstallButton from "@/components/PWA/PWAInstallButton";
import PWAManager from "@/components/PWA/PWAManager";
import ServiceWorkerProvider from "@/components/PWA/ServiceWorkerProvider";

export default function Home() {
  const [apiData, setApiData] = useState<IApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Хуки для UX улучшений
  const { toasts, success, error: showError, removeToast, info } = useToast();
  const { 
    searchQuery, 
    filteredArticles, 
    isSearching, 
    cacheHit,
    handleSearch, 
    clearSearch,
    resultCount 
  } = useSearch(apiData?.articles || []);

  const loadArticles = useCallback(async (page: number, isRetry: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Валидация входных параметров
      if (!Number.isInteger(page) || page < 1) {
        throw new Error('Некорректный номер страницы');
      }
      
      const data = await fetchArticles(page);
      
      // Дополнительная валидация данных
      if (!data || !Array.isArray(data.articles)) {
        throw new Error('Некорректный формат данных');
      }
      
      setApiData(data);
      setCurrentPage(page);
      setRetryCount(0); // Сбрасываем счетчик при успешной загрузке
      
      // Показываем уведомление об успешной загрузке
      if (data.articles.length > 0) {
        success(`Загружено ${data.articles.length} новостей`);
      } else {
        info('Новостей не найдено', 'Попробуйте обновить страницу позже');
      }
    } catch (err) {
      let errorMessage = 'Произошла неизвестная ошибка';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Логируем ошибку для отладки
      console.error('Ошибка загрузки статей:', {
        error: err,
        page,
        retryCount,
        timestamp: new Date().toISOString()
      });
      
      setError(errorMessage);
      showError('Ошибка загрузки', errorMessage);
      
      // Автоматический retry только для сетевых ошибок
      if (!isRetry && retryCount < APP_CONFIG.RETRY_ATTEMPTS) {
        const isNetworkError = errorMessage.includes('fetch') || 
                              errorMessage.includes('network') || 
                              errorMessage.includes('timeout') ||
                              errorMessage.includes('503') ||
                              errorMessage.includes('502');
        
        if (isNetworkError) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            loadArticles(page, true);
          }, APP_CONFIG.RETRY_DELAY_BASE * (retryCount + 1));
        }
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount, success, showError, info]);

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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="card animate-pulse">
          <div className="h-48 md:h-64 bg-gray-700 rounded-t-xl"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-700 rounded mb-3"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Компонент состояния ошибки
  const ErrorState = () => (
    <div className="text-center py-20">
      <div className="glass-effect rounded-2xl p-12 max-w-md mx-auto">
        <div className="text-red-400 text-6xl mb-6">⚠️</div>
        <div className="text-red-400 text-xl font-semibold mb-4">{UI_MESSAGES.ERROR_TITLE}</div>
        <p className="text-gray-300 mb-6">{error}</p>
        {retryCount > 0 && retryCount < APP_CONFIG.RETRY_ATTEMPTS && (
          <p className="text-yellow-400 mb-4">
            {UI_MESSAGES.RETRY_ATTEMPT} {retryCount + 1} {UI_MESSAGES.RETRY_OF} {APP_CONFIG.RETRY_ATTEMPTS}...
          </p>
        )}
        <button 
          onClick={() => loadArticles(currentPage)}
          className="btn-primary px-8 py-3"
        >
          {UI_MESSAGES.RETRY_BUTTON}
        </button>
      </div>
    </div>
  );

  // Компонент пустого состояния
  const EmptyState = () => (
    <div className="text-center py-20">
      <div className="glass-effect rounded-2xl p-12 max-w-md mx-auto">
        <div className="text-gray-400 text-6xl mb-6">
          {searchQuery ? '🔍' : '📰'}
        </div>
        <div className="text-gray-400 text-xl font-semibold mb-4">
          {searchQuery ? UI_MESSAGES.NO_RESULTS : UI_MESSAGES.EMPTY_TITLE}
        </div>
        <p className="text-gray-500 mb-6">
          {searchQuery 
            ? `По запросу "${searchQuery}" ничего не найдено` 
            : UI_MESSAGES.EMPTY_DESCRIPTION
          }
        </p>
        {searchQuery && (
          <button 
            onClick={clearSearch}
            className="btn-primary px-8 py-3"
          >
            Очистить поиск
          </button>
        )}
      </div>
    </div>
  );

  return (
    <ServiceWorkerProvider>
      <main className="min-h-screen pt-20">
      <Banner 
        title="Новости СВО" 
        description="Последние новости СВО за 2025 год от непосредственного участника событий" 
        variant="hero"
        showStats={true}
      />
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
        <div className="mb-12">
          <div className="glass-effect rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* Поиск и фильтры */}
              <div className="flex flex-col lg:flex-row gap-4 flex-1">
                <div className="flex-1 max-w-md">
                  <SearchBar 
                    onSearch={handleSearch}
                    placeholder="Поиск новостей СВО..."
                    showSuggestions={true}
                    showFilters={true}
                  />
                </div>
                <FilterBar
                  filters={FILTER_OPTIONS}
                  activeFilter={activeFilter}
                  onFilterChange={handleFilterChange}
                />
              </div>
              
              {/* Управляющие элементы */}
              <div className="flex items-center gap-3">
                <VoiceSearch onSearch={handleSearch} />
                <ThemeToggle />
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-3 glass-effect rounded-xl text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-200"
                  title="Настройки"
                >
                  <FiSettings className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Индикатор поиска */}
            {isSearching && (
              <div className="flex items-center gap-3 text-blue-400 text-sm mt-4 animate-pulse">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
                Поиск новостей...
              </div>
            )}

            {/* Результаты поиска */}
            {searchQuery && !isSearching && (
              <div className="flex items-center justify-between mt-4 p-4 bg-white/5 rounded-xl">
                <div className="text-sm text-gray-300">
                  Найдено: <span className="font-semibold text-white">{resultCount}</span> {resultCount === 1 ? 'новость' : 'новостей'}
                  {cacheHit && <span className="ml-2 text-green-400 text-xs">(из кэша)</span>}
                </div>
                <ExportFavorites />
              </div>
            )}
          </div>
        </div>

        {loading && <LoadingState />}
        
        {error && !loading && <ErrorState />}
        
        {!loading && !error && apiData && (
          <>
            {(searchQuery ? filteredArticles : apiData.articles).length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-16">
                  {(searchQuery ? filteredArticles : apiData.articles).map((news: INews, index: number) => (
                    <div 
                      key={news.id} 
                      className="relative group animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <NewsCard 
                        news={news} 
                        variant={index === 0 ? 'featured' : 'default'}
                        showStats={true}
                      />
                      {/* Кнопка избранного */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
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
      
      {/* Модальное окно настроек */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
      
      {/* Компоненты мониторинга (только в development режиме) */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <PerformanceMonitor />
          <ErrorMonitor />
          <AccessibilityChecker />
          <PWAManager className="fixed bottom-4 left-4 z-40 max-w-sm" />
        </>
      )}
      
      {/* PWA компоненты */}
      <PWAInstallButton />
    </main>
    </ServiceWorkerProvider>
  );
}
