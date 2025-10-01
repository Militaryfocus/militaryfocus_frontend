"use client";

import { useEffect, useState, useCallback } from "react";
import { FiSettings, FiHome } from "react-icons/fi";
import { fetchArticles } from "@/api/api/articles";
import Banner from "@/components/Banner/Banner";
import ContainerDefault from "@/components/Containers/ContainerDefault";
import NewsCard from "@/components/News/NewsCard";
import SkeletonCard from "@/components/Loading/SkeletonCard";
import SearchBar from "@/components/Search/SearchBar";
import FilterBar from "@/components/Filter/FilterBar";
import ThemeToggle from "@/components/Theme/ThemeToggle";
import ToastContainer from "@/components/Toast/ToastContainer";
import FavoriteButton from "@/components/Favorites/FavoriteButton";
import SettingsModal from "@/components/Settings/SettingsModal";
import VoiceSearch from "@/components/VoiceSearch/VoiceSearch";
import ExportFavorites from "@/components/Export/ExportFavorites";
import MicroInteraction, { FadeIn } from "@/components/Animations/MicroInteractions";
import { LoadingProgress } from "@/components/Progress/ProgressBar";
import { Tooltip, Tour, useTour } from "@/components/Help/Tooltips";
import { KeyboardShortcuts, useKeyboardShortcuts } from "@/components/Keyboard/KeyboardShortcuts";
import SmartSorting, { Recommendations } from "@/components/Smart/SmartSorting";
import { Breadcrumbs, PageNavigation } from "@/components/Navigation/EnhancedNavigation";
import { NavigationGestures, useDeviceType, GestureTutorial, useGestures } from "@/components/Gestures/SwipeGestures";
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sortedArticles, setSortedArticles] = useState<INews[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Хуки для UX улучшений
  const { toasts, success, error: showError, removeToast } = useToast();
  const { shortcuts, addShortcut } = useKeyboardShortcuts();
  const { isOpen: isTourOpen, startTour, closeTour, completeTour } = useTour();
  const { isTouchDevice } = useDeviceType();
  const { gesturesEnabled, showTutorial, closeTutorial } = useGestures();
  
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
      setLoadingProgress(0);
      
      // Симуляция прогресса загрузки
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + 10, 90));
      }, 100);
      
      const data = await fetchArticles(page);
      clearInterval(progressInterval);
      setLoadingProgress(100);
      
      setApiData(data);
      setSortedArticles(data.articles);
      setCurrentPage(page);
      setRetryCount(0);
      
      // Показываем уведомление об успешной загрузке
      if (data.articles.length > 0) {
        success(`Загружено ${data.articles.length} новостей`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла неизвестная ошибка';
      setError(errorMessage);
      showError('Ошибка загрузки', errorMessage);
      
      if (!isRetry && retryCount < APP_CONFIG.RETRY_ATTEMPTS) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadArticles(page, true);
        }, APP_CONFIG.RETRY_DELAY_BASE * (retryCount + 1));
      }
    } finally {
      setLoading(false);
      setLoadingProgress(0);
    }
  }, [retryCount, success, showError]);

  useEffect(() => {
    loadArticles(1);
  }, [loadArticles]);

  // Настройка клавиатурных сокращений
  useEffect(() => {
    addShortcut({
      key: 'ctrl+f',
      description: 'Поиск',
      action: () => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }
    });

    addShortcut({
      key: 'ctrl+s',
      description: 'Настройки',
      action: () => setIsSettingsOpen(true)
    });

    addShortcut({
      key: 'escape',
      description: 'Закрыть модальные окна',
      action: () => {
        setIsSettingsOpen(false);
        closeTour();
      }
    });

    addShortcut({
      key: 'ctrl+h',
      description: 'Показать помощь',
      action: () => startTour('main-tour')
    });
  }, [addShortcut, closeTour, startTour]);

  const handlePageChange = useCallback((page: number) => {
    loadArticles(page);
  }, [loadArticles]);

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

  // Обработчики жестов
  const handleGestureNext = useCallback(() => {
    if (apiData && currentPage < apiData.totalPages!) {
      handlePageChange(currentPage + 1);
    }
  }, [apiData, currentPage, handlePageChange]);

  const handleGesturePrevious = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  const handleGestureRefresh = useCallback(() => {
    loadArticles(currentPage);
    success('Страница обновлена');
  }, [loadArticles, currentPage, success]);

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
    <NavigationGestures
      onNext={gesturesEnabled ? handleGestureNext : undefined}
      onPrevious={gesturesEnabled ? handleGesturePrevious : undefined}
      onRefresh={gesturesEnabled ? handleGestureRefresh : undefined}
    >
      <main className="pb-[100px] max-[425px]:pb-[80px]">
      {/* Прогресс загрузки */}
      <LoadingProgress 
        isLoading={loading} 
        progress={loadingProgress}
        message="Загружаем новости..."
      />

      <Banner title="Новости СВО" description="Последние новости СВО за 2025 год" />
      <ContainerDefault>
        {/* Улучшенные хлебные крошки */}
        <FadeIn delay={100}>
          <div className="mb-[40px] max-[425px]:mb-[60px]">
            <Breadcrumbs 
              items={[
                { label: 'Главная', href: '/', icon: <FiHome className="h-4 w-4" /> },
                { label: 'Новости' }
              ]}
              className="max-[425px]:hidden"
            />
          </div>
        </FadeIn>

        {/* Панель управления с микро-взаимодействиями */}
        <FadeIn delay={200}>
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Поиск и фильтры */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1 max-w-md">
                  <MicroInteraction type="focus" animation="scale" intensity="subtle">
                    <SearchBar
                      onSearch={handleSearch}
                      placeholder={UI_MESSAGES.SEARCH_PLACEHOLDER}
                    />
                  </MicroInteraction>
                </div>
                <MicroInteraction type="hover" animation="scale" intensity="subtle">
                  <FilterBar
                    filters={FILTER_OPTIONS}
                    activeFilter={activeFilter}
                    onFilterChange={handleFilterChange}
                  />
                </MicroInteraction>
              </div>

              {/* Управляющие элементы */}
              <div className="flex items-center gap-2">
                <MicroInteraction type="hover" animation="bounce" intensity="subtle">
                  <VoiceSearch onSearch={handleSearch} />
                </MicroInteraction>
                
                <MicroInteraction type="hover" animation="scale" intensity="subtle">
                  <ThemeToggle />
                </MicroInteraction>
                
                <MicroInteraction type="click" animation="scale" intensity="medium">
                  <Tooltip content="Настройки приложения (Ctrl+S)">
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400
                               hover:text-white hover:bg-gray-700 transition-colors"
                      title="Настройки"
                    >
                      <FiSettings className="h-4 w-4" />
                    </button>
                  </Tooltip>
                </MicroInteraction>

                <KeyboardShortcuts shortcuts={shortcuts} />
              </div>
            </div>

            {/* Умная сортировка */}
            <FadeIn delay={300}>
              <SmartSorting 
                articles={apiData?.articles || []}
                onSort={setSortedArticles}
              />
            </FadeIn>

            {/* Индикатор поиска */}
            {isSearching && (
              <div className="flex items-center gap-2 text-blue-400 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                Поиск...
              </div>
            )}

            {/* Результаты поиска */}
            {searchQuery && !isSearching && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Найдено: {resultCount} {resultCount === 1 ? 'новость' : 'новостей'}
                  {cacheHit && <span className="ml-2 text-green-400">(из кэша)</span>}
                </div>
                <ExportFavorites />
              </div>
            )}
          </div>
        </FadeIn>

        {loading && <LoadingState />}
        
        {error && !loading && <ErrorState />}

        {!loading && !error && apiData && (
          <>
            {(searchQuery ? filteredArticles : sortedArticles).length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {/* Рекомендации */}
                {!searchQuery && sortedArticles.length > 0 && (
                  <FadeIn delay={400}>
                    <div className="mb-6">
                      <Recommendations articles={sortedArticles} />
                    </div>
                  </FadeIn>
                )}

                {/* Сетка новостей с микро-взаимодействиями */}
                <FadeIn delay={500}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-[40px] md:mb-[60px]">
                    {(searchQuery ? filteredArticles : sortedArticles).map((news: INews, index: number) => (
                      <MicroInteraction 
                        key={news.id} 
                        type="load" 
                        animation="fade" 
                        delay={index * 100}
                        className="relative group"
                      >
                        <NewsCard news={news} />
                        {/* Кнопка избранного с тултипом */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Tooltip content="Добавить в избранное">
                            <FavoriteButton
                              news={news}
                              onToggle={handleFavoriteToggle}
                            />
                          </Tooltip>
                        </div>
                      </MicroInteraction>
                    ))}
                  </div>
                </FadeIn>

                {/* Улучшенная пагинация */}
                {!searchQuery && apiData.totalPages && apiData.totalPages > 1 && (
                  <FadeIn delay={600}>
                    <PageNavigation
                      currentPage={currentPage}
                      totalPages={apiData.totalPages}
                      onPageChange={handlePageChange}
                      showQuickJump={true}
                    />
                  </FadeIn>
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

      {/* Интерактивный тур */}
      <Tour
        steps={[
          {
            id: 'search',
            target: 'input[type="text"]',
            title: 'Поиск новостей',
            content: 'Используйте поиск для быстрого нахождения интересующих вас новостей. Поддерживается поиск по заголовкам и датам.',
            position: 'bottom'
          },
          {
            id: 'filters',
            target: 'select',
            title: 'Фильтрация',
            content: 'Фильтруйте новости по категориям: СВО, Вооружение, Аналитика и другие.',
            position: 'bottom'
          },
          {
            id: 'favorites',
            target: 'button[aria-label*="избранное"]',
            title: 'Избранное',
            content: 'Добавляйте понравившиеся новости в избранное для быстрого доступа.',
            position: 'left'
          },
          {
            id: 'settings',
            target: 'button[title="Настройки"]',
            title: 'Настройки',
            content: 'Настройте приложение под себя: тема, размер шрифта, уведомления и многое другое.',
            position: 'left'
          }
        ]}
        isOpen={isTourOpen}
        onClose={closeTour}
        onComplete={completeTour}
      />

      {/* Обучение жестам */}
      <GestureTutorial
        isVisible={showTutorial && isTouchDevice}
        onClose={closeTutorial}
      />
      </main>
    </NavigationGestures>
  );
}
