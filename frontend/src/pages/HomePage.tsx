import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import './HomePage.css';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Newspaper, 
  Star, 
  Eye, 
  Heart,
  Play,
  Shield,
  Sword,
  Zap,
  Target,
  Award,
  Clock,
  MessageCircle,
  ChevronRight,
  Search,
  Filter,
  Grid,
  List,
  ArrowRight,
  Sparkles,
  Crown,
  Flame,
  TrendingDown,
  BarChart3,
  Gamepad2,
  Trophy,
  Users2,
  Calendar,
  Globe
} from 'lucide-react';
import apiService from '../services/api';
import HeroCard from '../components/Hero/HeroCard';
import GuideCard from '../components/Guide/GuideCard';
import NewsCard from '../components/News/NewsCard';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('heroes');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Получаем данные для главной страницы
  const { data: heroesStats, isLoading: statsLoading } = useQuery('heroes-stats', apiService.getHeroesStats);
  const { data: trendingGuides, isLoading: guidesLoading } = useQuery('trending-guides', () => apiService.getTrendingGuides({ limit: 6 }));
  const { data: latestNews, isLoading: newsLoading } = useQuery('latest-news', () => apiService.getLatestNews({ limit: 3 }));
  const { data: popularHeroes, isLoading: heroesLoading } = useQuery('popular-heroes', () => apiService.getHeroes({ limit: 12 }));
  const { data: topHeroes, isLoading: topHeroesLoading } = useQuery('top-heroes', () => apiService.getHeroes({ limit: 6, sort: 'win_rate' }));

  // Анимация счетчиков
  const [animatedStats, setAnimatedStats] = useState({
    heroes: 0,
    guides: 0,
    winRate: 0,
    pickRate: 0
  });

  useEffect(() => {
    if (heroesStats) {
      const animateCounter = (key: keyof typeof animatedStats, target: number, duration: number = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setAnimatedStats(prev => ({ ...prev, [key]: current }));
        }, 16);
      };

      animateCounter('heroes', heroesStats.total_heroes || 0);
      animateCounter('guides', trendingGuides?.length || 0);
      animateCounter('winRate', heroesStats.avg_win_rate || 0);
      animateCounter('pickRate', heroesStats.avg_pick_rate || 0);
    }
  }, [heroesStats, trendingGuides]);

  const heroRoles = [
    { name: 'Tank', icon: Shield, color: 'blue', count: popularHeroes?.filter(h => h.role === 'Tank').length || 0 },
    { name: 'Fighter', icon: Sword, color: 'red', count: popularHeroes?.filter(h => h.role === 'Fighter').length || 0 },
    { name: 'Assassin', icon: Zap, color: 'purple', count: popularHeroes?.filter(h => h.role === 'Assassin').length || 0 },
    { name: 'Mage', icon: Sparkles, color: 'pink', count: popularHeroes?.filter(h => h.role === 'Mage').length || 0 },
    { name: 'Marksman', icon: Target, color: 'green', count: popularHeroes?.filter(h => h.role === 'Marksman').length || 0 },
    { name: 'Support', icon: Heart, color: 'yellow', count: popularHeroes?.filter(h => h.role === 'Support').length || 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section - Полноэкранный баннер */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Анимированный фон */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </div>
        
        {/* Плавающие элементы */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-400 rounded-full opacity-25 animate-pulse"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Crown className="w-4 h-4 mr-2 text-yellow-400" />
              <span>Лучшая платформа для Mobile Legends</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Добро пожаловать в
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                ML Community
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Фан-сообщество Mobile Legends: Bang Bang с системой управления героями, 
              гайдами, сборками и тактиками. Станьте частью лучшего игрового сообщества!
            </p>
          </div>

          {/* Поиск */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск героев, гайдов, новостей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-gray-900 px-6 py-2 rounded-xl font-semibold hover:bg-yellow-300 transition-colors">
                Найти
              </button>
            </div>
          </div>

          {/* CTA кнопки */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/heroes"
              className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <span className="flex items-center justify-center">
                Изучить героев
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              to="/guides"
              className="group border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <span className="flex items-center justify-center">
                Читать гайды
                <BookOpen className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
            </Link>
          </div>
        </div>

        {/* Прокрутка вниз */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-white rotate-90" />
        </div>
      </section>

      {/* Статистика */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Статистика сообщества
            </h2>
            <p className="text-xl text-gray-600">
              Цифры, которые говорят сами за себя
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">
                {Math.floor(animatedStats.heroes)}
              </h3>
              <p className="text-gray-600 font-medium">Героев в базе</p>
            </div>
            
            <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">
                {Math.floor(animatedStats.guides)}
              </h3>
              <p className="text-gray-600 font-medium">Популярных гайдов</p>
            </div>
            
            <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">
                {animatedStats.winRate.toFixed(1)}%
              </h3>
              <p className="text-gray-600 font-medium">Средний винрейт</p>
            </div>
            
            <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">
                {animatedStats.pickRate.toFixed(1)}%
              </h3>
              <p className="text-gray-600 font-medium">Средний пикрейт</p>
            </div>
          </div>
        </div>
      </section>

      {/* Роли героев */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Роли героев
            </h2>
            <p className="text-xl text-gray-600">
              Изучите различные роли и найдите свой стиль игры
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {heroRoles.map((role, index) => (
              <div
                key={role.name}
                className="group bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 bg-${role.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <role.icon className={`w-6 h-6 text-${role.color}-600`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{role.name}</h3>
                <p className="text-sm text-gray-600">{role.count} героев</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Популярные герои */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Популярные герои</h2>
              <p className="text-gray-600">Самые востребованные герои сообщества</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <Link
                to="/heroes"
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Смотреть всех
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {popularHeroes?.slice(0, 8).map((hero, index) => (
              <div
                key={hero.id}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <HeroCard hero={hero} showStats={true} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Топ герои по винрейту */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Crown className="w-8 h-8 mr-3 text-yellow-500" />
              Топ герои по винрейту
            </h2>
            <p className="text-xl text-gray-600">
              Самые эффективные герои в текущем мете
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topHeroes?.slice(0, 6).map((hero, index) => (
              <div
                key={hero.id}
                className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{hero.name}</h3>
                      <p className="text-sm text-gray-600">{hero.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{hero.win_rate}%</div>
                    <div className="text-xs text-gray-500">Win Rate</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Pick Rate: {hero.pick_rate}%</span>
                  <span>Ban Rate: {hero.ban_rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Популярные гайды */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <Flame className="w-8 h-8 mr-3 text-orange-500" />
                Популярные гайды
              </h2>
              <p className="text-gray-600">Лучшие гайды от опытных игроков</p>
            </div>
            <Link
              to="/guides"
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Смотреть все
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingGuides?.map((guide, index) => (
              <div
                key={guide.id}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <GuideCard guide={guide} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Последние новости */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <Newspaper className="w-8 h-8 mr-3 text-purple-500" />
                Последние новости
              </h2>
              <p className="text-gray-600">Свежие новости из мира Mobile Legends</p>
            </div>
            <Link
              to="/news"
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Смотреть все
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews?.map((news, index) => (
              <div
                key={news.id}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <NewsCard news={news} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Присоединяйтесь к сообществу!
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Создавайте гайды, делитесь опытом и помогайте другим игрокам стать лучше
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <span className="flex items-center justify-center">
                Зарегистрироваться
                <Users2 className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </span>
            </Link>
            <Link
              to="/guides/builder"
              className="group border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <span className="flex items-center justify-center">
                Создать гайд
                <BookOpen className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Статистика сообщества */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">1000+</div>
              <div className="text-blue-100">Активных игроков</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">500+</div>
              <div className="text-blue-100">Гайдов создано</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-blue-100">Поддержка сообщества</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;