import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Heart, 
  Star, 
  Eye, 
  Calendar, 
  User as UserIcon,
  Shield,
  Zap,
  Edit2,
  Trash2,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/services/auth';
import apiService from '@/services/api';
import { BuildGuide, Hero, User } from '@/types';
import toast from 'react-hot-toast';

const GuideDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  // Fetch guide details
  const { data: guide, isLoading: guideLoading } = useQuery<BuildGuide>(
    ['guide', id],
    () => apiService.getGuide(parseInt(id!)),
    {
      enabled: !!id,
      onSuccess: (data) => {
        // Check if user has already rated this guide (would need to fetch user ratings)
        // For now, we'll just show the form
      }
    }
  );

  // Fetch guide author
  const { data: author } = useQuery<User>(
    ['user', guide?.author_id],
    () => apiService.getUser(guide!.author_id),
    { enabled: !!guide?.author_id }
  );

  // Fetch hero details
  const { data: hero } = useQuery<Hero>(
    ['hero', guide?.hero_id],
    () => apiService.getHero(guide!.hero_id),
    { enabled: !!guide?.hero_id }
  );

  // Like mutation
  const likeMutation = useMutation(
    () => apiService.likeGuide(parseInt(id!)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['guide', id]);
        setHasLiked(!hasLiked);
        toast.success(hasLiked ? 'Лайк убран' : 'Лайк поставлен!');
      },
      onError: () => {
        toast.error('Ошибка при лайке');
      }
    }
  );

  // Rating mutation
  const ratingMutation = useMutation(
    ({ rating, review }: { rating: number; review?: string }) =>
      apiService.rateGuide(parseInt(id!), rating, review),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['guide', id]);
        setShowRatingForm(false);
        setUserRating(0);
        setReview('');
        toast.success('Оценка отправлена!');
      },
      onError: () => {
        toast.error('Ошибка при отправке оценки');
      }
    }
  );

  // Delete mutation
  const deleteMutation = useMutation(
    () => apiService.deleteGuide(parseInt(id!)),
    {
      onSuccess: () => {
        toast.success('Гайд удален');
        navigate('/guides');
      },
      onError: () => {
        toast.error('Ошибка при удалении гайда');
      }
    }
  );

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('Войдите, чтобы лайкать гайды');
      navigate('/login');
      return;
    }
    likeMutation.mutate();
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Войдите, чтобы оценить гайд');
      navigate('/login');
      return;
    }

    if (userRating === 0) {
      toast.error('Выберите оценку');
      return;
    }

    ratingMutation.mutate({ rating: userRating, review });
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этот гайд?')) {
      deleteMutation.mutate();
    }
  };

  const canEdit = user && guide && (user.id === guide.author_id || ['Admin', 'Moderator'].includes(user.role));
  const canDelete = user && guide && (user.id === guide.author_id || ['Admin', 'Moderator'].includes(user.role));

  if (guideLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Гайд не найден</h1>
          <button
            onClick={() => navigate('/guides')}
            className="btn btn-primary"
          >
            К списку гайдов
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                guide.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                guide.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {guide.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                {guide.play_style}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{guide.title}</h1>
            
            {hero && (
              <div className="flex items-center text-gray-600 mb-4">
                <span className="font-medium">{hero.name}</span>
                <span className="mx-2">•</span>
                <span>{hero.role}</span>
              </div>
            )}

            {guide.description && (
              <p className="text-gray-700 mb-4">{guide.description}</p>
            )}

            {/* Tags */}
            {guide.tags && guide.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {guide.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author Info */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-1" />
                <span onClick={() => navigate(`/profile/${guide.author_id}`)} className="hover:text-primary-600 cursor-pointer">
                  {author?.username || 'Автор'}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(guide.created_at).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {canEdit && (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/guides/builder/${id}`)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Редактировать
              </button>
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats and Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center justify-center space-x-2">
            <Eye className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{guide.views}</p>
              <p className="text-sm text-gray-600">Просмотров</p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={handleLike}
              disabled={likeMutation.isLoading}
              className={`flex items-center space-x-2 ${hasLiked ? 'text-red-600' : 'text-gray-500'} hover:text-red-600 transition-colors`}
            >
              <Heart className={`h-5 w-5 ${hasLiked ? 'fill-current' : ''}`} />
              <div>
                <p className="text-2xl font-bold">{guide.likes}</p>
                <p className="text-sm">Лайков</p>
              </div>
            </button>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{guide.rating.toFixed(1)}</p>
              <p className="text-sm text-gray-600">Рейтинг</p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <MessageSquare className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{guide.rating_count}</p>
              <p className="text-sm text-gray-600">Оценок</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Оценить гайд</h2>
          {!showRatingForm && (
            <button
              onClick={() => setShowRatingForm(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Оставить оценку
            </button>
          )}
        </div>

        {showRatingForm && (
          <form onSubmit={handleRatingSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ваша оценка
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setUserRating(rating)}
                    onMouseEnter={() => setHoverRating(rating)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        (hoverRating || userRating) >= rating
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Отзыв (опционально)</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={3}
                className="form-input"
                placeholder="Поделитесь своим мнением о гайде..."
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={ratingMutation.isLoading}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {ratingMutation.isLoading ? 'Отправка...' : 'Отправить оценку'}
              </button>
              <button
                type="button"
                onClick={() => setShowRatingForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Build Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emblems */}
        {guide.emblems && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Эмблемы
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Тип</span>
                <span className="font-semibold text-gray-900">{guide.emblems.type}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Уровень</span>
                <span className="font-semibold text-gray-900">{guide.emblems.level}</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">Таланты:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li className="text-gray-900">{guide.emblems.talents.talent1}</li>
                  <li className="text-gray-900">{guide.emblems.talents.talent2}</li>
                  <li className="text-gray-900 font-semibold">{guide.emblems.talents.talent3}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Battle Spell */}
        {guide.battle_spell && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-purple-500" />
              Боевое заклинание
            </h2>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{guide.battle_spell}</p>
            </div>
          </div>
        )}

        {/* Item Build */}
        {guide.item_build && (
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-500" />
              Сборка предметов
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Ранняя игра</h3>
                <div className="flex flex-wrap gap-2">
                  {guide.item_build.early_game.map((itemId, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center font-semibold text-green-800"
                    >
                      {itemId}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Средняя игра</h3>
                <div className="flex flex-wrap gap-2">
                  {guide.item_build.mid_game.map((itemId, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center font-semibold text-yellow-800"
                    >
                      {itemId}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Поздняя игра</h3>
                <div className="flex flex-wrap gap-2">
                  {guide.item_build.late_game.map((itemId, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center font-semibold text-red-800"
                    >
                      {itemId}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideDetailPage;