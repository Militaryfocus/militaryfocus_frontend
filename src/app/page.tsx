"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchArticles } from "@/api/api/articles";
import Banner from "@/components/Banner/Banner";
import ContainerDefault from "@/components/Containers/ContainerDefault";
import NewsCard from "@/components/News/NewsCard";
import Pagination from "@/components/Pagination/Pagination";
import SkeletonCard from "@/components/Loading/SkeletonCard";
import { INews, IApiResponse } from "@/types/news.types";
import { APP_CONFIG, UI_MESSAGES } from "@/constants/app.constants";

export default function Home() {
  const [apiData, setApiData] = useState<IApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);

  const loadArticles = useCallback(async (page: number, isRetry: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchArticles(page);
      setApiData(data);
      setCurrentPage(page);
      setRetryCount(0); // Сбрасываем счетчик при успешной загрузке
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
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
  }, [retryCount]);

  useEffect(() => {
    loadArticles(1);
  }, [loadArticles]);

  const handlePageChange = (page: number) => {
    loadArticles(page);
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
      <div className="text-gray-400 text-lg mb-4">{UI_MESSAGES.EMPTY_TITLE}</div>
      <p className="text-gray-500">{UI_MESSAGES.EMPTY_DESCRIPTION}</p>
    </div>
  );

  return (
    <main className="pb-[100px] max-[425px]:pb-[80px]">
      <Banner title="Новости СВО" description="Последние новости СВО за 2025 год" />
      <ContainerDefault>
        <div className="mb-[40px] max-[425px]:mb-[60px]">
          <div className="flex items-center gap-2 text-white mb-[20px] max-[425px]:hidden">
            <span>Главная</span>
            <span>/</span>
            <span>Новости</span>
          </div>
        </div>

        {loading && <LoadingState />}
        
        {error && !loading && <ErrorState />}
        
        {!loading && !error && apiData && (
          <>
            {apiData.articles.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-[40px] md:mb-[60px]">
                  {apiData.articles.map((news: INews) => (
                    <NewsCard key={news.id} news={news} />
                  ))}
                </div>

                {apiData.totalPages && apiData.totalPages > 1 && (
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
    </main>
  );
}
