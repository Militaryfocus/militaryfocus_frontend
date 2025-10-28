import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, Gamepad2 } from 'lucide-react';
import { useAuth } from '@/services/auth';
import { RegisterRequest } from '@/types';

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest & { confirmPassword: string }>();

  const password = watch('password');

  const onSubmit = async (data: RegisterRequest & { confirmPassword: string }) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
      navigate('/');
    } catch (error) {
      // Ошибка уже обработана в useAuth
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">ML</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Создание аккаунта
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Уже есть аккаунт?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Войдите
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email обязателен',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Неверный формат email'
                    }
                  })}
                  type="email"
                  className="form-input pl-10"
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="form-label">
                Имя пользователя
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('username', {
                    required: 'Имя пользователя обязательно',
                    minLength: {
                      value: 3,
                      message: 'Минимум 3 символа'
                    },
                    maxLength: {
                      value: 20,
                      message: 'Максимум 20 символов'
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_-]+$/,
                      message: 'Только латиница, цифры, _ и -'
                    }
                  })}
                  type="text"
                  className="form-input pl-10"
                  placeholder="username"
                />
              </div>
              {errors.username && (
                <p className="form-error">{errors.username.message}</p>
              )}
            </div>

            {/* IGN (In-Game Name) - Optional */}
            <div>
              <label htmlFor="ign" className="form-label">
                Игровой ник <span className="text-gray-400 text-sm">(необязательно)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Gamepad2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('ign')}
                  type="text"
                  className="form-input pl-10"
                  placeholder="Ваш ник в Mobile Legends"
                />
              </div>
            </div>

            {/* Current Rank - Optional */}
            <div>
              <label htmlFor="current_rank" className="form-label">
                Текущий ранг <span className="text-gray-400 text-sm">(необязательно)</span>
              </label>
              <select
                {...register('current_rank')}
                className="form-input"
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

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label">
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Пароль обязателен',
                    minLength: {
                      value: 6,
                      message: 'Минимум 6 символов'
                    },
                    maxLength: {
                      value: 50,
                      message: 'Максимум 50 символов'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="form-input pl-10 pr-10"
                  placeholder="Введите пароль"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Подтверждение пароля
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('confirmPassword', {
                    required: 'Подтвердите пароль',
                    validate: value =>
                      value === password || 'Пароли не совпадают'
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input pl-10 pr-10"
                  placeholder="Повторите пароль"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="form-error">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Terms and conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                Я согласен с{' '}
                <a href="/terms" className="text-primary-600 hover:text-primary-500">
                  условиями использования
                </a>{' '}
                и{' '}
                <a href="/privacy" className="text-primary-600 hover:text-primary-500">
                  политикой конфиденциальности
                </a>
              </label>
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Регистрация...
                </div>
              ) : (
                'Зарегистрироваться'
              )}
            </button>
          </div>

          {/* Password requirements */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Требования к паролю:</h3>
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
              <li>Минимум 6 символов</li>
              <li>Рекомендуется использовать буквы, цифры и спецсимволы</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;