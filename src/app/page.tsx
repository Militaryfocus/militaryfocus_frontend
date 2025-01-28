"use client";

import { useEffect, useState } from "react";
import { fetchArticles } from "@/api/api/articles";
import Banner from "@/components/Banner/Banner";
import ContainerDefault from "@/components/Containers/ContainerDefault";
import NewsCard from "@/components/News/NewsCard";
import Pagination from "@/components/Pagination/Pagination";
import { INews } from "@/types/news.types";

export default function Home() {
  const [articles, setArticles] = useState<INews[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetchArticles()
      .then((data) => {
        setArticles(data.articles);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-[40px] md:mb-[60px]">
          {articles && articles && articles.map((news: INews) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={254} // Укажите реальное количество страниц
          onPageChange={handlePageChange}
        />
      </ContainerDefault>
    </main>
  );
}
