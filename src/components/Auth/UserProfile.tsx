"use client";

import { useState, useEffect } from 'react';
import { FiUser, FiSettings, FiHeart, FiLogOut, FiEdit3, FiSave, FiX } from 'react-icons/fi';
import { useAuth, useUser } from '@/hooks/useApi';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user, logout } = useAuth();
  const { profile, favorites, isLoading, updateProfile, fetchFavorites } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    bio: '',
    preferences: {
      theme: 'auto' as 'light' | 'dark' | 'auto',
      language: 'ru',
      notifications: true,
      emailNotifications: true,
    }
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchFavorites();
      if (profile) {
        setEditData({
          name: profile.name || '',
          bio: profile.bio || '',
          preferences: profile.preferences || editData.preferences
        });
      }
    }
  }, [isOpen, user, profile, fetchFavorites, editData.preferences]);

  const handleSave = async () => {
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: profile?.name || '',
      bio: profile?.bio || '',
      preferences: profile?.preferences || editData.preferences
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-2xl p-6 w-full max-w-2xl glass-effect max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <FiUser size={24} />
            <span>Профиль пользователя</span>
          </h2>
          <button
            onClick={onClose}
            className="text-green-300 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка - Информация о пользователе */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-xl p-6">
              {/* Аватар */}
              <div className="text-center mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center text-green-900 text-2xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h3 className="text-xl font-semibold text-white mt-3">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-white/10 border border-green-600 rounded-lg px-3 py-1 text-white text-center"
                    />
                  ) : (
                    user.name || 'Пользователь'
                  )}
                </h3>
                <p className="text-green-200 text-sm">{user.email}</p>
              </div>

              {/* Био */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-green-200 mb-2">
                  О себе
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-white/10 border border-green-600 rounded-lg px-3 py-2 text-white text-sm resize-none"
                    rows={3}
                    placeholder="Расскажите о себе..."
                  />
                ) : (
                  <p className="text-green-200 text-sm">
                    {profile?.bio || 'Пользователь не указал информацию о себе'}
                  </p>
                )}
              </div>

              {/* Кнопки управления */}
              <div className="space-y-2">
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <FiSave size={16} />
                      <span>Сохранить</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <FiX size={16} />
                      <span>Отмена</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                  >
                    <FiEdit3 size={16} />
                    <span>Редактировать профиль</span>
                  </button>
                )}
                
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                >
                  <FiLogOut size={16} />
                  <span>Выйти</span>
                </button>
              </div>
            </div>
          </div>

          {/* Правая колонка - Настройки и статистика */}
          <div className="lg:col-span-2 space-y-6">
            {/* Настройки */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <FiSettings size={20} />
                <span>Настройки</span>
              </h3>
              
              <div className="space-y-4">
                {/* Тема */}
                <div>
                  <label className="block text-sm font-medium text-green-200 mb-2">
                    Тема оформления
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.preferences.theme}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, theme: e.target.value as 'light' | 'dark' | 'auto' }
                      }))}
                      className="w-full bg-white/10 border border-green-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="light">Светлая</option>
                      <option value="dark">Темная</option>
                      <option value="auto">Автоматическая</option>
                    </select>
                  ) : (
                    <p className="text-green-200 text-sm">
                      {profile?.preferences?.theme === 'light' ? 'Светлая' :
                       profile?.preferences?.theme === 'dark' ? 'Темная' : 'Автоматическая'}
                    </p>
                  )}
                </div>

                {/* Уведомления */}
                <div>
                  <label className="block text-sm font-medium text-green-200 mb-2">
                    Уведомления
                  </label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editData.preferences.notifications}
                          onChange={(e) => setEditData(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, notifications: e.target.checked }
                          }))}
                          className="rounded border-green-600 bg-white/10 text-green-500 focus:ring-green-500"
                        />
                        <span className="text-green-200 text-sm">Push уведомления</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editData.preferences.emailNotifications}
                          onChange={(e) => setEditData(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, emailNotifications: e.target.checked }
                          }))}
                          className="rounded border-green-600 bg-white/10 text-green-500 focus:ring-green-500"
                        />
                        <span className="text-green-200 text-sm">Email уведомления</span>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-green-200 text-sm">
                        Push: {profile?.preferences?.notifications ? 'Включены' : 'Отключены'}
                      </p>
                      <p className="text-green-200 text-sm">
                        Email: {profile?.preferences?.emailNotifications ? 'Включены' : 'Отключены'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Статистика */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <FiHeart size={20} />
                <span>Статистика</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {favorites.length}
                  </div>
                  <div className="text-green-200 text-sm">Избранных новостей</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '—'}
                  </div>
                  <div className="text-green-200 text-sm">Дата регистрации</div>
                </div>
              </div>
            </div>

            {/* Избранные новости */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <FiHeart size={20} />
                <span>Избранные новости</span>
              </h3>
              
              {isLoading ? (
                <div className="text-center text-green-200">Загрузка...</div>
              ) : favorites.length > 0 ? (
                <div className="space-y-2">
                  {favorites.slice(0, 5).map((favorite: any) => (
                    <div key={favorite.id} className="bg-white/5 rounded-lg p-3">
                      <h4 className="text-white text-sm font-medium">{favorite.title}</h4>
                      <p className="text-green-200 text-xs">{favorite.date}</p>
                    </div>
                  ))}
                  {favorites.length > 5 && (
                    <p className="text-green-200 text-sm text-center">
                      И еще {favorites.length - 5} новостей...
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-green-200 text-sm text-center">
                  У вас пока нет избранных новостей
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}