import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Newspaper, 
  Star, 
  Eye, 
  Heart, 
  Search,
  Settings,
  MessageSquare,
  Award,
  Target,
  Zap,
  Shield,
  Sword,
  Crown,
  Gamepad2,
  BarChart3,
  Calendar,
  UserPlus,
  FileText,
  Video,
  Image,
  Download
} from 'lucide-react';
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/heroes"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Изучить героев
            </Link>
            <Link
              to="/guides"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Читать гайды
            </Link>
            <Link
              to="/search"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Поиск
            </Link>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">100+</div>
              <div className="text-sm text-blue-100">Героев</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">500+</div>
              <div className="text-sm text-blue-100">Гайдов</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">1K+</div>
              <div className="text-sm text-blue-100">Пользователей</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">24/7</div>
              <div className="text-sm text-blue-100">Поддержка</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Modules Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Модули платформы</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Полный набор инструментов для изучения Mobile Legends и улучшения игрового опыта
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Heroes Module */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Герои</h3>
                <p className="text-sm text-gray-600">База данных героев</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Изучайте характеристики, навыки, контрпики и синергии всех героев Mobile Legends
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Характеристики</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Навыки</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Контрпики</span>
            </div>
            <Link
              to="/heroes"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Изучить героев
              <TrendingUp className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Guides Module */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Гайды</h3>
                <p className="text-sm text-gray-600">Сборки и стратегии</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Создавайте и изучайте гайды по героям, сборки предметов и игровые стратегии
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Сборки</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Стратегии</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Эмблимы</span>
            </div>
            <Link
              to="/guides"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
            >
              Читать гайды
              <BookOpen className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* News Module */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Newspaper className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Новости</h3>
                <p className="text-sm text-gray-600">Актуальные события</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Следите за последними новостями, обновлениями и событиями в мире Mobile Legends
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Обновления</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">События</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Турниры</span>
            </div>
            <Link
              to="/news"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
            >
              Читать новости
              <Newspaper className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Search Module */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <Search className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Поиск</h3>
                <p className="text-sm text-gray-600">Быстрый поиск</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Находите героев, гайды, новости и пользователей с помощью умного поиска
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Герои</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Гайды</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Пользователи</span>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
            >
              Начать поиск
              <Search className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Profile Module */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <UserPlus className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Профиль</h3>
                <p className="text-sm text-gray-600">Личный кабинет</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Управляйте своим профилем, создавайте гайды и отслеживайте статистику
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">Статистика</span>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">Гайды</span>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">Настройки</span>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
            >
              Мой профиль
              <UserPlus className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Guide Builder Module */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Конструктор</h3>
                <p className="text-sm text-gray-600">Создание гайдов</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Создавайте собственные гайды с помощью удобного конструктора сборок
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Сборки</span>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Эмблимы</span>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Стратегии</span>
            </div>
            <Link
              to="/guides/builder"
              className="inline-flex items-center text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
            >
              Создать гайд
              <FileText className="w-4 h-4 ml-1" />
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

      {/* Features Section */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Возможности платформы</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Все необходимые инструменты для изучения Mobile Legends в одном месте
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Статистика</h3>
            <p className="text-gray-600 text-sm">Детальная статистика героев, винрейты, пикрейты</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Контрпики</h3>
            <p className="text-gray-600 text-sm">Система контрпиков и синергий между героями</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Рейтинги</h3>
            <p className="text-gray-600 text-sm">Рейтинговая система для гайдов и пользователей</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Обсуждения</h3>
            <p className="text-gray-600 text-sm">Комментарии и обсуждения к гайдам</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Присоединяйтесь к сообществу!</h2>
        <p className="text-xl mb-8 text-green-100">
          Создавайте гайды, делитесь опытом и помогайте другим игрокам
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <UserPlus className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Регистрация</h3>
            <p className="text-sm text-green-100">Создайте аккаунт за минуту</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <FileText className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Создание гайдов</h3>
            <p className="text-sm text-green-100">Поделитесь своими знаниями</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <MessageSquare className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Общение</h3>
            <p className="text-sm text-green-100">Общайтесь с единомышленниками</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Зарегистрироваться
          </Link>
          <Link
            to="/guides/builder"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Создать гайд
          </Link>
          <Link
            to="/login"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Войти
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;