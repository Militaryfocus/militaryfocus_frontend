import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Users,
  BookOpen,
  TrendingUp,
  Shield,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { useAuth, useRole } from '@/services/auth';
import apiService from '@/services/api';
import { User, BuildGuide } from '@/types';
import toast from 'react-hot-toast';

type TabType = 'overview' | 'users' | 'guides' | 'moderation';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      toast.error('Доступ запрещен');
    }
  }, [isAdmin, navigate]);

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>(
    'admin-users',
    () => apiService.getUsers({ limit: 100 }),
    { enabled: isAdmin() }
  );

  // Fetch guides
  const { data: guides = [], isLoading: guidesLoading } = useQuery<BuildGuide[]>(
    'admin-guides',
    () => apiService.getGuides({ limit: 100 })
  );

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.is_active).length,
    totalGuides: guides.length,
    publishedGuides: guides.filter(g => g.is_published).length,
    avgRating: guides.length > 0
      ? (guides.reduce((sum, g) => sum + g.rating, 0) / guides.length).toFixed(1)
      : '0.0',
    totalViews: guides.reduce((sum, g) => sum + g.views, 0),
  };

  // Verify user mutation
  const verifyMutation = useMutation(
    (userId: number) => apiService.verifyUser(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-users');
        toast.success('Пользователь верифицирован');
      },
      onError: () => {
        toast.error('Ошибка верификации');
      }
    }
  );

  // Deactivate user mutation
  const deactivateMutation = useMutation(
    (userId: number) => apiService.deactivateUser(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-users');
        toast.success('Пользователь деактивирован');
      },
      onError: () => {
        toast.error('Ошибка деактивации');
      }
    }
  );

  // Activate user mutation
  const activateMutation = useMutation(
    (userId: number) => apiService.activateUser(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-users');
        toast.success('Пользователь активирован');
      },
      onError: () => {
        toast.error('Ошибка активации');
      }
    }
  );

  // Change role mutation
  const changeRoleMutation = useMutation(
    ({ userId, role }: { userId: number; role: string }) =>
      apiService.changeUserRole(userId, role),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-users');
        toast.success('Роль изменена');
      },
      onError: () => {
        toast.error('Ошибка изменения роли');
      }
    }
  );

  // Delete guide mutation
  const deleteGuideMutation = useMutation(
    (guideId: number) => apiService.deleteGuide(guideId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-guides');
        toast.success('Гайд удален');
      },
      onError: () => {
        toast.error('Ошибка удаления гайда');
      }
    }
  );

  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Shield className="h-8 w-8 mr-3 text-red-600" />
          Панель администратора
        </h1>
        <p className="text-gray-600 mt-2">
          Управление пользователями, контентом и модерация платформы
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Всего пользователей</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-sm text-green-600 mt-1">
                {stats.activeUsers} активных
              </p>
            </div>
            <Users className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Всего гайдов</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalGuides}</p>
              <p className="text-sm text-green-600 mt-1">
                {stats.publishedGuides} опубликовано
              </p>
            </div>
            <BookOpen className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Средний рейтинг</p>
              <p className="text-3xl font-bold text-gray-900">{stats.avgRating}</p>
              <p className="text-sm text-gray-500 mt-1">из 5.0</p>
            </div>
            <TrendingUp className="h-12 w-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Всего просмотров</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalViews.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">на всех гайдах</p>
            </div>
            <Eye className="h-12 w-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Обзор
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'users'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Пользователи ({stats.totalUsers})
            </button>
            <button
              onClick={() => setActiveTab('guides')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'guides'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Гайды ({stats.totalGuides})
            </button>
            <button
              onClick={() => setActiveTab('moderation')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'moderation'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Модерация
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Быстрые действия
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => navigate('/guides/builder')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Создать гайд</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('users')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-blue-50 transition-colors"
                  >
                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Управление пользователями</p>
                  </button>

                  <button
                    onClick={() => navigate('/statistics')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-blue-50 transition-colors"
                  >
                    <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Статистика</p>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Последние гайды
                </h3>
                <div className="space-y-3">
                  {guides.slice(0, 5).map((guide) => (
                    <div
                      key={guide.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{guide.title}</h4>
                        <p className="text-sm text-gray-600">
                          {guide.views} просмотров • {guide.likes} лайков
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/guides/${guide.id}`)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              {usersLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Пользователь
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Роль
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Статус
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">
                                  {u.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{u.username}</div>
                                <div className="text-sm text-gray-500">ID: {u.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {u.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={u.role}
                              onChange={(e) => changeRoleMutation.mutate({ userId: u.id, role: e.target.value })}
                              className="text-sm border border-gray-300 rounded-md px-2 py-1"
                            >
                              <option value="User">User</option>
                              <option value="Content Creator">Content Creator</option>
                              <option value="Moderator">Moderator</option>
                              <option value="Admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {u.is_active ? (
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                  Активен
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                  Неактивен
                                </span>
                              )}
                              {u.is_verified && (
                                <CheckCircle className="h-4 w-4 text-blue-500" title="Верифицирован" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              {!u.is_verified && (
                                <button
                                  onClick={() => verifyMutation.mutate(u.id)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Верифицировать"
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                              )}
                              {u.is_active ? (
                                <button
                                  onClick={() => deactivateMutation.mutate(u.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Деактивировать"
                                >
                                  <XCircle className="h-5 w-5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => activateMutation.mutate(u.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Активировать"
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                              )}
                              <button
                                onClick={() => navigate(`/profile/${u.id}`)}
                                className="text-gray-600 hover:text-gray-900"
                                title="Просмотр профиля"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Guides Tab */}
          {activeTab === 'guides' && (
            <div>
              {guidesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {guides.map((guide) => (
                    <div
                      key={guide.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-500"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{guide.title}</h3>
                          {guide.is_published ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Опубликован
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                              Черновик
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>ID: {guide.id}</span>
                          <span>Автор: {guide.author_id}</span>
                          <span>{guide.views} просмотров</span>
                          <span>{guide.likes} лайков</span>
                          <span>★ {guide.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/guides/${guide.id}`)}
                          className="p-2 text-gray-600 hover:text-gray-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/guides/builder/${guide.id}`)}
                          className="p-2 text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Удалить этот гайд?')) {
                              deleteGuideMutation.mutate(guide.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Moderation Tab */}
          {activeTab === 'moderation' && (
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Модерация в разработке
              </h3>
              <p className="text-gray-600">
                Функционал модерации комментариев и контента будет добавлен в следующих версиях
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
