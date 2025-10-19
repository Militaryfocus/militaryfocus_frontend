import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from 'react-query';
import { 
  Save, 
  Eye, 
  Upload, 
  Search, 
  Plus, 
  X, 
  Star,
  Zap,
  Shield,
  Sword,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/services/auth';
import apiService from '@/services/api';
import { BuildGuide, Hero } from '@/types';
import toast from 'react-hot-toast';

interface GuideFormData {
  hero_id: number;
  title: string;
  description: string;
  battle_spell: string;
  play_style: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  item_build: {
    early_game: number[];
    mid_game: number[];
    late_game: number[];
  };
  emblems: {
    type: string;
    level: number;
    talents: {
      talent1: string;
      talent2: string;
      talent3: string;
    };
  };
  skill_priority: number[];
  version: string;
}

const GuideBuilderPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [heroSearch, setHeroSearch] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  
  const isEditMode = !!id;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      toast.error('Пожалуйста, войдите в систему');
    }
  }, [isAuthenticated, navigate]);

  // Fetch heroes for selection
  const { data: heroes = [], isLoading: heroesLoading } = useQuery<Hero[]>(
    'heroes',
    () => apiService.getHeroes()
  );

  // Fetch existing guide if editing
  const { data: existingGuide, isLoading: guideLoading } = useQuery<BuildGuide>(
    ['guide', id],
    () => apiService.getGuide(parseInt(id!)),
    { enabled: isEditMode }
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GuideFormData>({
    defaultValues: {
      hero_id: 0,
      title: '',
      description: '',
      battle_spell: 'Flicker',
      play_style: 'Aggressive',
      difficulty: 'Medium',
      tags: [],
      item_build: {
        early_game: [],
        mid_game: [],
        late_game: [],
      },
      emblems: {
        type: 'Custom Mage',
        level: 60,
        talents: {
          talent1: 'Agility',
          talent2: 'Observation',
          talent3: 'Impure Rage',
        },
      },
      skill_priority: [3, 2, 1, 3, 2],
      version: '1.0',
    },
  });

  // Load existing guide data
  useEffect(() => {
    if (existingGuide && heroes.length > 0) {
      setValue('hero_id', existingGuide.hero_id);
      setValue('title', existingGuide.title);
      setValue('description', existingGuide.description || '');
      setValue('battle_spell', existingGuide.battle_spell || 'Flicker');
      setValue('play_style', existingGuide.play_style || 'Aggressive');
      setValue('difficulty', existingGuide.difficulty || 'Medium');
      setValue('tags', existingGuide.tags || []);
      
      if (existingGuide.item_build) {
        setValue('item_build', existingGuide.item_build);
      }
      if (existingGuide.emblems) {
        setValue('emblems', existingGuide.emblems);
      }
      if (existingGuide.skill_priority) {
        setValue('skill_priority', existingGuide.skill_priority);
      }

      const hero = heroes.find(h => h.id === existingGuide.hero_id);
      if (hero) {
        setSelectedHero(hero);
      }
    }
  }, [existingGuide, heroes, setValue]);

  const watchedHeroId = watch('hero_id');
  const watchedTags = watch('tags');

  // Available battle spells
  const battleSpells = [
    'Flicker', 'Purify', 'Sprint', 'Execute', 'Retribution',
    'Inspire', 'Vengeance', 'Arrival', 'Aegis', 'Petrify'
  ];

  // Available emblem types
  const emblemTypes = [
    'Custom Mage', 'Custom Marksman', 'Custom Assassin',
    'Custom Fighter', 'Custom Tank', 'Custom Support'
  ];

  // Filter heroes based on search
  const filteredHeroes = heroes.filter(hero =>
    hero.name.toLowerCase().includes(heroSearch.toLowerCase()) ||
    hero.role.toLowerCase().includes(heroSearch.toLowerCase())
  );

  const onSubmit = async (data: GuideFormData) => {
    if (!selectedHero) {
      toast.error('Пожалуйста, выберите героя');
      return;
    }

    try {
      const guideData = {
        ...data,
        hero_id: selectedHero.id,
        is_published: true,
      };

      if (isEditMode) {
        await apiService.updateGuide(parseInt(id!), guideData);
        toast.success('Гайд успешно обновлен!');
      } else {
        const newGuide = await apiService.createGuide(guideData);
        toast.success('Гайд успешно создан!');
        navigate(`/guides/${newGuide.id}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Ошибка при сохранении гайда');
    }
  };

  const handleSaveDraft = async () => {
    const data = watch();
    
    try {
      const guideData = {
        ...data,
        hero_id: selectedHero?.id || data.hero_id,
        is_published: false,
      };

      if (isEditMode) {
        await apiService.updateGuide(parseInt(id!), guideData);
      } else {
        await apiService.createGuide(guideData);
      }
      
      toast.success('Черновик сохранен!');
    } catch (error: any) {
      toast.error('Ошибка при сохранении черновика');
    }
  };

  const addTag = () => {
    if (tagInput && !watchedTags.includes(tagInput)) {
      setValue('tags', [...watchedTags, tagInput]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setValue('tags', watchedTags.filter(t => t !== tag));
  };

  if (guideLoading || heroesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Редактирование гайда' : 'Создание гайда'}
          </h1>
          <p className="text-gray-600 mt-2">
            Создайте подробный гайд для выбранного героя
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Редактор' : 'Предпросмотр'}
          </button>
          <button
            onClick={handleSaveDraft}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Save className="h-4 w-4 mr-2" />
            Сохранить черновик
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hero Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Sword className="h-5 w-5 mr-2" />
            Выбор героя
          </h2>
          
          {selectedHero ? (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">
                    {selectedHero.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedHero.name}</h3>
                  <p className="text-sm text-gray-600">{selectedHero.role} • {selectedHero.specialty}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHero(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск героя..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                {filteredHeroes.map((hero) => (
                  <div
                    key={hero.id}
                    onClick={() => {
                      setSelectedHero(hero);
                      setValue('hero_id', hero.id);
                    }}
                    className="p-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-white font-bold">
                        {hero.name.charAt(0)}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm text-gray-900">{hero.name}</h4>
                    <p className="text-xs text-gray-600">{hero.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Основная информация
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="form-label">Название гайда *</label>
              <input
                {...register('title', { required: 'Название обязательно' })}
                type="text"
                className="form-input"
                placeholder="Например: Полный гайд по Fanny для новичков"
              />
              {errors.title && (
                <p className="form-error">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Описание</label>
              <textarea
                {...register('description')}
                rows={4}
                className="form-input"
                placeholder="Опишите суть гайда, для кого он предназначен..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Сложность</label>
                <select {...register('difficulty')} className="form-input">
                  <option value="Easy">Легко</option>
                  <option value="Medium">Средне</option>
                  <option value="Hard">Сложно</option>
                </select>
              </div>

              <div>
                <label className="form-label">Стиль игры</label>
                <select {...register('play_style')} className="form-input">
                  <option value="Aggressive">Агрессивный</option>
                  <option value="Defensive">Защитный</option>
                  <option value="Balanced">Сбалансированный</option>
                  <option value="Support">Поддержка</option>
                  <option value="Pusher">Пушер</option>
                </select>
              </div>

              <div>
                <label className="form-label">Боевое заклинание</label>
                <select {...register('battle_spell')} className="form-input">
                  {battleSpells.map(spell => (
                    <option key={spell} value={spell}>{spell}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="form-label">Теги</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="form-input flex-1"
                  placeholder="Добавить тег..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchedTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Emblems */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2" />
            Эмблемы
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Тип эмблемы</label>
              <select {...register('emblems.type')} className="form-input">
                {emblemTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Уровень</label>
              <input
                {...register('emblems.level', { 
                  min: 1, 
                  max: 60,
                  valueAsNumber: true 
                })}
                type="number"
                className="form-input"
                min="1"
                max="60"
              />
            </div>

            <div>
              <label className="form-label">Талант 1</label>
              <input
                {...register('emblems.talents.talent1')}
                type="text"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Талант 2</label>
              <input
                {...register('emblems.talents.talent2')}
                type="text"
                className="form-input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Талант 3 (Основной)</label>
              <input
                {...register('emblems.talents.talent3')}
                type="text"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Item Build */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Сборка предметов
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="form-label">Ранняя игра (Early Game)</label>
              <input
                {...register('item_build.early_game')}
                type="text"
                className="form-input"
                placeholder="Введите ID предметов через запятую: 1,2,3"
              />
              <p className="text-sm text-gray-500 mt-1">
                Предметы для начала игры (первые 5-10 минут)
              </p>
            </div>

            <div>
              <label className="form-label">Средняя игра (Mid Game)</label>
              <input
                {...register('item_build.mid_game')}
                type="text"
                className="form-input"
                placeholder="Введите ID предметов через запятую: 4,5,6"
              />
              <p className="text-sm text-gray-500 mt-1">
                Основные предметы (10-20 минут)
              </p>
            </div>

            <div>
              <label className="form-label">Поздняя игра (Late Game)</label>
              <input
                {...register('item_build.late_game')}
                type="text"
                className="form-input"
                placeholder="Введите ID предметов через запятую: 7,8,9"
              />
              <p className="text-sm text-gray-500 mt-1">
                Финальная сборка (после 20 минут)
              </p>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Отмена
          </button>
          
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isEditMode ? 'Обновить гайд' : 'Опубликовать гайд'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuideBuilderPage;