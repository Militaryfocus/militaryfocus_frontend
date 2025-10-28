import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Shield, 
  Gamepad2, 
  Trophy, 
  Eye, 
  Heart, 
  Star,
  BookOpen,
  Settings,
  LogOut,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '@/services/auth';
import { useQuery } from 'react-query';
import apiService from '@/services/api';
import { User, BuildGuide, UserProfile } from '@/types';
import toast from 'react-hot-toast';

type TabType = 'overview' | 'guides' | 'settings';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user: currentUser, logout, updateUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditing, setIsEditing] = useState(false);
  
  const userId = id ? parseInt(id) : currentUser?.id;
  const isOwnProfile = !id || (currentUser && parseInt(id) === currentUser.id);

  // Redirect to login if not authenticated and trying to view own profile
  useEffect(() => {
    if (!id && !isAuthenticated) {
      navigate('/login');
    }
  }, [id, isAuthenticated, navigate]);

  // Fetch user profile
  const { data: userProfile, isLoading: profileLoading, refetch: refetchProfile } = useQuery<UserProfile>(
    ['user', userId],
    () => userId ? apiService.getUser(userId) : Promise.reject('No user ID'),
    { enabled: !!userId }
  );

  // Fetch user stats
  const { data: userStats, isLoading: statsLoading } = useQuery(
    ['userStats', userId],
    () => userId ? apiService.getUserStats(userId) : Promise.reject('No user ID'),
    { enabled: !!userId }
  );

  // Fetch user guides
  const { data: userGuides, isLoading: guidesLoading } = useQuery<BuildGuide[]>(
    ['userGuides', userId],
    () => userId ? apiService.getUserGuides(userId) : Promise.reject('No user ID'),
    { enabled: !!userId && activeTab === 'guides' }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<User>>();

  // Reset form when user profile loads
  useEffect(() => {
    if (userProfile) {
      reset({
        email: userProfile.email,
        username: userProfile.username,
        ign: userProfile.ign,
        current_rank: userProfile.current_rank,
      });
    }
  }, [userProfile, reset]);

  const onSubmit = async (data: Partial<User>) => {
    try {
      await updateUser(data);
      setIsEditing(false);
      refetchProfile();
      toast.success('Профиль обновлен!');
    } catch (error) {
      toast.error('Ошибка обновления профиля');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Пользователь не найден</h1>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {userProfile.username.charAt(0).toUpperCase()}
              </span>
            </div>
            
            {/* User Info */}
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900">{userProfile.username}</h1>
                {userProfile.is_verified && (
                  <Shield className="h-5 w-5 text-blue-500" title="Верифицирован" />
                )}
              </div>
              {userProfile.ign && (
                <p className="text-gray-600 flex items-center mt-1">
                  <Gamepad2 className="h-4 w-4 mr-1" />
                  {userProfile.ign}
                </p>
              )}
              {userProfile.current_rank && (
                <p className="text-gray-600 flex items-center mt-1">
                  <Trophy className="h-4 w-4 mr-1" />
                  {userProfile.current_rank}
                </p>
              )}
              <div className="flex items-center space-x-3 mt-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  userProfile.role === 'Admin' ? 'bg-red-100 text-red-800' :
                  userProfile.role === 'Moderator' ? 'bg-purple-100 text-purple-800' :
                  userProfile.role === 'Content Creator' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {userProfile.role}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Зарегистрирован {new Date(userProfile.created_at).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {isOwnProfile && (
            <div className="flex space-x-2">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Гайдов</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.guides_count || 0}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Просмотров</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.total_views || 0}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Лайков</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.total_likes || 0}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Рейтинг</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.average_rating?.toFixed(1) || '0.0'}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Обзор
            </button>
            <button
              onClick={() => setActiveTab('guides')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'guides'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Гайды ({userStats?.guides_count || 0})
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Настройки
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о пользователе</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{userProfile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Username</p>
                      <p className="font-medium text-gray-900">{userProfile.username}</p>
                    </div>
                  </div>
                  {userProfile.ign && (
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Gamepad2 className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Игровой ник</p>
                        <p className="font-medium text-gray-900">{userProfile.ign}</p>
                      </div>
                    </div>
                  )}
                  {userProfile.current_rank && (
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Trophy className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Ранг</p>
                        <p className="font-medium text-gray-900">{userProfile.current_rank}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {userProfile.main_heroes && userProfile.main_heroes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Основные герои</h3>
                  <p className="text-gray-600">ID героев: {userProfile.main_heroes.join(', ')}</p>
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
              ) : userGuides && userGuides.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userGuides.map((guide) => (
                    <div
                      key={guide.id}
                      onClick={() => navigate(`/guides/${guide.id}`)}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 cursor-pointer transition-colors"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">{guide.title}</h4>
                      {guide.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{guide.description}</p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {guide.views}
                          </span>
                          <span className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            {guide.likes}
                          </span>
                          <span className="flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            {guide.rating.toFixed(1)}
                          </span>
                        </div>
                        {guide.difficulty && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            guide.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            guide.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {guide.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {isOwnProfile ? 'Вы еще не создали ни одного гайда' : 'У пользователя пока нет гайдов'}
                  </p>
                  {isOwnProfile && (
                    <button
                      onClick={() => navigate('/guides/builder')}
                      className="mt-4 btn btn-primary"
                    >
                      Создать гайд
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && isOwnProfile && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Настройки профиля</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Редактировать
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Отмена
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="form-label">Email</label>
                  <input
                    {...register('email', {
                      required: 'Email обязателен',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Неверный формат email'
                      }
                    })}
                    type="email"
                    disabled={!isEditing}
                    className="form-input disabled:bg-gray-100"
                  />
                  {errors.email && (
                    <p className="form-error">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Имя пользователя</label>
                  <input
                    {...register('username', {
                      required: 'Имя пользователя обязательно',
                      minLength: {
                        value: 3,
                        message: 'Минимум 3 символа'
                      }
                    })}
                    type="text"
                    disabled={!isEditing}
                    className="form-input disabled:bg-gray-100"
                  />
                  {errors.username && (
                    <p className="form-error">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Игровой ник</label>
                  <input
                    {...register('ign')}
                    type="text"
                    disabled={!isEditing}
                    className="form-input disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="form-label">Текущий ранг</label>
                  <select
                    {...register('current_rank')}
                    disabled={!isEditing}
                    className="form-input disabled:bg-gray-100"
                  >
                    <option value="">Выберите ранг</option>
                    <option value="Warrior">Warrior</option>
                    <option value="Elite">Elite</option>
                    <option value="Master">Master</option>
                    <option value="Grandmaster">Grandmaster</option>
                    <option value="Epic">Epic</option>
                    <option value="Legend">Legend</option>
                    <option value="Mythic">Mythic</option>
                    <option value="Mythical Glory">Mythical Glory</option>
                  </select>
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Сохранить изменения
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;