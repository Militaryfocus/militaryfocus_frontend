import React from 'react';
import { useQuery } from 'react-query';
import {
  TrendingUp,
  Users,
  BookOpen,
  Eye,
  Heart,
  Star,
  Trophy,
  Target,
  Activity,
  BarChart3
} from 'lucide-react';
import apiService from '@/services/api';
import { BuildGuide, Hero, User } from '@/types';

const StatisticsPage: React.FC = () => {
  // Fetch all data for statistics
  const { data: guides = [] } = useQuery<BuildGuide[]>(
    'stats-guides',
    () => apiService.getGuides({ limit: 1000 })
  );

  const { data: heroes = [] } = useQuery<Hero[]>(
    'stats-heroes',
    () => apiService.getHeroes({ limit: 1000 })
  );

  const { data: users = [] } = useQuery<User[]>(
    'stats-users',
    () => apiService.getUsers({ limit: 1000 })
  );

  // Calculate platform statistics
  const platformStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.is_active).length,
    verifiedUsers: users.filter(u => u.is_verified).length,
    totalHeroes: heroes.length,
    totalGuides: guides.length,
    publishedGuides: guides.filter(g => g.is_published).length,
    totalViews: guides.reduce((sum, g) => sum + g.views, 0),
    totalLikes: guides.reduce((sum, g) => sum + g.likes, 0),
    avgRating: guides.length > 0
      ? (guides.reduce((sum, g) => sum + g.rating, 0) / guides.length)
      : 0,
    totalRatings: guides.reduce((sum, g) => sum + g.rating_count, 0),
  };

  // Top heroes by guides count
  const heroGuideCounts = guides.reduce((acc, guide) => {
    acc[guide.hero_id] = (acc[guide.hero_id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const topHeroesByGuides = Object.entries(heroGuideCounts)
    .map(([heroId, count]) => ({
      hero: heroes.find(h => h.id === parseInt(heroId)),
      count
    }))
    .filter(item => item.hero)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top guides by views
  const topGuidesByViews = [...guides]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Top guides by rating
  const topGuidesByRating = [...guides]
    .filter(g => g.rating_count >= 3) // At least 3 ratings
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  // Top guides by likes
  const topGuidesByLikes = [...guides]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 10);

  // Guides by difficulty
  const guidesByDifficulty = {
    Easy: guides.filter(g => g.difficulty === 'Easy').length,
    Medium: guides.filter(g => g.difficulty === 'Medium').length,
    Hard: guides.filter(g => g.difficulty === 'Hard').length,
  };

  // Guides by play style
  const playStyleCounts = guides.reduce((acc, guide) => {
    if (guide.play_style) {
      acc[guide.play_style] = (acc[guide.play_style] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Hero role distribution
  const roleDistribution = heroes.reduce((acc, hero) => {
    acc[hero.role] = (acc[hero.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // User role distribution
  const userRoles = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="h-8 w-8 mr-3 text-purple-600" />
          Статистика платформы
        </h1>
        <p className="text-gray-600 mt-2">
          Подробная статистика и аналитика Mobile Legends Community
        </p>
      </div>

      {/* Platform Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Обзор платформы</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8" />
              <span className="text-3xl font-bold">{platformStats.totalUsers}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Пользователей</h3>
            <p className="text-blue-100 text-sm">
              {platformStats.activeUsers} активных • {platformStats.verifiedUsers} верифицировано
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="h-8 w-8" />
              <span className="text-3xl font-bold">{platformStats.totalGuides}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Гайдов</h3>
            <p className="text-green-100 text-sm">
              {platformStats.publishedGuides} опубликовано
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Eye className="h-8 w-8" />
              <span className="text-3xl font-bold">{platformStats.totalViews.toLocaleString()}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Просмотров</h3>
            <p className="text-purple-100 text-sm">
              Среднее: {Math.round(platformStats.totalViews / (platformStats.totalGuides || 1))} на гайд
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Star className="h-8 w-8" />
              <span className="text-3xl font-bold">{platformStats.avgRating.toFixed(1)}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Средний рейтинг</h3>
            <p className="text-yellow-100 text-sm">
              {platformStats.totalRatings} оценок
            </p>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Всего героев</h3>
            <Trophy className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{platformStats.totalHeroes}</p>
          <p className="text-sm text-gray-600 mt-2">В базе данных</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Всего лайков</h3>
            <Heart className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{platformStats.totalLikes}</p>
          <p className="text-sm text-gray-600 mt-2">
            Среднее: {Math.round(platformStats.totalLikes / (platformStats.totalGuides || 1))} на гайд
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Активность</h3>
            <Activity className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {((platformStats.activeUsers / (platformStats.totalUsers || 1)) * 100).toFixed(0)}%
          </p>
          <p className="text-sm text-gray-600 mt-2">Активных пользователей</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Heroes by Guides */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            Топ героев по количеству гайдов
          </h2>
          <div className="space-y-3">
            {topHeroesByGuides.map((item, index) => (
              <div key={item.hero?.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {item.hero?.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.hero?.name}</p>
                    <p className="text-sm text-gray-600">{item.hero?.role}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-primary-600">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Guides by Views */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2 text-purple-500" />
            Топ гайдов по просмотрам
          </h2>
          <div className="space-y-3">
            {topGuidesByViews.map((guide, index) => (
              <div key={guide.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{guide.title}</p>
                    <p className="text-sm text-gray-600">★ {guide.rating.toFixed(1)} • {guide.likes} лайков</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-purple-600 ml-2">{guide.views}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Guides by Rating */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Топ гайдов по рейтингу
          </h2>
          <div className="space-y-3">
            {topGuidesByRating.map((guide, index) => (
              <div key={guide.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{guide.title}</p>
                    <p className="text-sm text-gray-600">{guide.views} просмотров • {guide.rating_count} оценок</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-yellow-600 ml-2">★ {guide.rating.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Guides by Likes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-500" />
            Топ гайдов по лайкам
          </h2>
          <div className="space-y-3">
            {topGuidesByLikes.map((guide, index) => (
              <div key={guide.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{guide.title}</p>
                    <p className="text-sm text-gray-600">{guide.views} просмотров • ★ {guide.rating.toFixed(1)}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-red-600 ml-2">❤️ {guide.likes}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guides by Difficulty */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Гайды по сложности</h2>
          <div className="space-y-3">
            {Object.entries(guidesByDifficulty).map(([difficulty, count]) => (
              <div key={difficulty}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700">{difficulty}</span>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      difficulty === 'Easy' ? 'bg-green-500' :
                      difficulty === 'Medium' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${(count / platformStats.totalGuides) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Role Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Распределение по ролям</h2>
          <div className="space-y-3">
            {Object.entries(roleDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([role, count]) => (
                <div key={role}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700">{role}</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(count / platformStats.totalHeroes) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* User Role Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Роли пользователей</h2>
          <div className="space-y-3">
            {Object.entries(userRoles)
              .sort((a, b) => b[1] - a[1])
              .map(([role, count]) => (
                <div key={role}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700">{role}</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(count / platformStats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
