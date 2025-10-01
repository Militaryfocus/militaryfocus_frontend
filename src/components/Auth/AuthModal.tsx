"use client";

import { useState } from 'react';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiLoader } from 'react-icons/fi';
import { useAuth } from '@/hooks/useApi';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Очищаем ошибку при изменении
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let result;
      
      if (mode === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Пароли не совпадают');
          return;
        }
        result = await register(formData.name, formData.email, formData.password, formData.confirmPassword);
      }

      if (result.success) {
        onClose();
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      } else {
        setError(result.error);
      }
    } catch (error: any) {
      setError(error.message || 'Произошла ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModeChange = (newMode: 'login' | 'register') => {
    onModeChange(newMode);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-2xl p-8 w-full max-w-md glass-effect">
        {/* Заголовок */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'login' ? 'Вход в систему' : 'Регистрация'}
          </h2>
          <p className="text-green-200 text-sm">
            {mode === 'login' 
              ? 'Войдите в свой аккаунт Military Focus' 
              : 'Создайте новый аккаунт Military Focus'
            }
          </p>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Имя (только для регистрации) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-green-200 mb-2">
                Имя
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={mode === 'register'}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-green-600 rounded-lg text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Введите ваше имя"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-green-200 mb-2">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-green-600 rounded-lg text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Введите ваш email"
              />
            </div>
          </div>

          {/* Пароль */}
          <div>
            <label className="block text-sm font-medium text-green-200 mb-2">
              Пароль
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-green-600 rounded-lg text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Введите пароль"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-white transition-colors"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Подтверждение пароля (только для регистрации) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-green-200 mb-2">
                Подтвердите пароль
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={mode === 'register'}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-green-600 rounded-lg text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Подтвердите пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>
          )}

          {/* Ошибка */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Кнопка отправки */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-green-900 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="animate-spin" size={20} />
                <span>Обработка...</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</span>
            )}
          </button>
        </form>

        {/* Переключение режима */}
        <div className="mt-6 text-center">
          <p className="text-green-200 text-sm">
            {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
          </p>
          <button
            onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
            className="text-yellow-400 hover:text-yellow-300 font-medium text-sm transition-colors"
          >
            {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </div>

        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-green-300 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}