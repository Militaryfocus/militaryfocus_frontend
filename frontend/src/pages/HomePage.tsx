import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { TrendingUp, Users, BookOpen, Newspaper, Star, Eye, Heart } from 'lucide-react';
import apiService from '@/services/api';
import HeroCard from '@/components/Hero/HeroCard';
import GuideCard from '@/components/Guide/GuideCard';
import NewsCard from '@/components/News/NewsCard';

const HomePage: React.FC = () => {
  // Получаем данные для главной страницы
  const { data: heroesStats } = useQuery('heroes-stats', apiService.getHeroesStats);
  const { data: trendingGuides } = useQuery('trending-guides', () => apiService.getTrendingGuides({ limit: 6 }));
  const { data: latestNews } = useQuery('latest-news', () => apiService.getLatestNews({ limit: 3 }));
  const { data: popularHeroes } = useQuery('popular-heroes', () => apiService.getHeroes({ limit: 8 }));

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Добро пожаловать в
            <span className="block text-yellow-400">ML Community</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Фан-сообщество Mobile Legends: Bang Bang с системой управления героями, 
            гайдами, сборками и тактиками
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/heroes"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Изучить героев
            </Link>
            <Link
              to="/guides"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              Читать гайды
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{heroesStats?.total_heroes || 0}</h3>
          <p className="text-gray-600">Героев в базе</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-md text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{trendingGuides?.length || 0}</h3>
          <p className="text-gray-600">Популярных гайдов</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-md text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{heroesStats?.avg_win_rate?.toFixed(1) || 0}%</h3>
          <p className="text-gray-600">Средний винрейт</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-md text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{heroesStats?.avg_pick_rate?.toFixed(1) || 0}%</h3>
          <p className="text-gray-600">Средний пикрейт</p>
        </div>
      </section>

      {/* Popular Heroes Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Популярные герои</h2>
          <Link
            to="/heroes"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
          >
            Смотреть всех
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularHeroes?.slice(0, 8).map((hero) => (
            <HeroCard key={hero.id} hero={hero} showStats={true} />
          ))}
        </div>
      </section>

      {/* Trending Guides Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-primary-600" />
            Популярные гайды
          </h2>
          <Link
            to="/guides"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
          >
            Смотреть все
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingGuides?.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      </section>

      {/* Latest News Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Newspaper className="w-6 h-6 mr-2 text-primary-600" />
            Последние новости
          </h2>
          <Link
            to="/news"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
          >
            Смотреть все
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews?.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Присоединяйтесь к сообществу!</h2>
        <p className="text-xl mb-6 text-green-100">
          Создавайте гайды, делитесь опытом и помогайте другим игрокам
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Зарегистрироваться
          </Link>
          <Link
            to="/guides/builder"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200"
          >
            Создать гайд
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;