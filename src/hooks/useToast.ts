import { useState, useCallback } from 'react';
import { Toast, ToastType } from '../components/Toast/ToastContainer';

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    if (!id || typeof id !== 'string') {
      console.warn('Toast: некорректный ID для удаления');
      return;
    }
    
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((
    type: ToastType,
    title: string,
    message?: string,
    duration: number = 5000
  ) => {
    // Валидация входных параметров
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      console.warn('Toast: заголовок не может быть пустым');
      return null;
    }
    
    if (duration < 1000 || duration > 30000) {
      console.warn('Toast: длительность должна быть от 1 до 30 секунд');
      duration = 5000;
    }
    
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      type,
      title: title.trim(),
      message: message?.trim(),
      duration,
    };

    setToasts(prev => {
      // Ограничиваем количество уведомлений
      const maxToasts = 5;
      const updatedToasts = [...prev, newToast];
      
      if (updatedToasts.length > maxToasts) {
        return updatedToasts.slice(-maxToasts);
      }
      
      return updatedToasts;
    });
    
    // Автоматическое удаление уведомления
    setTimeout(() => {
      removeToast(id);
    }, duration);
    
    return id;
  }, [removeToast]);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Удобные методы для разных типов уведомлений
  const success = useCallback((title: string, message?: string, duration?: number) => {
    return addToast('success', title, message, duration);
  }, [addToast]);

  const error = useCallback((title: string, message?: string, duration?: number) => {
    return addToast('error', title, message, duration);
  }, [addToast]);

  const info = useCallback((title: string, message?: string, duration?: number) => {
    return addToast('info', title, message, duration);
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    return addToast('warning', title, message, duration);
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    info,
    warning,
  };
};