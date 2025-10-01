"use client";

import { useState, useEffect, useCallback } from 'react';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastComponent = ({ toast, onRemove }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleRemove = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  }, [toast.id, onRemove]);

  useEffect(() => {
    // Анимация появления
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FiCheck className="h-5 w-5 text-green-400" />;
      case 'error':
        return <FiX className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <FiAlertCircle className="h-5 w-5 text-yellow-400" />;
      case 'info':
      default:
        return <FiInfo className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-900/20 border-green-500/30';
      case 'error':
        return 'bg-red-900/20 border-red-500/30';
      case 'warning':
        return 'bg-yellow-900/20 border-yellow-500/30';
      case 'info':
      default:
        return 'bg-blue-900/20 border-blue-500/30';
    }
  };

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${getBackgroundColor()}
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
        ${isLeaving ? 'scale-95' : 'scale-100'}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white mb-1">
          {toast.title}
        </h4>
        {toast.message && (
          <p className="text-sm text-gray-300">
            {toast.message}
          </p>
        )}
      </div>
      
      <button
        onClick={handleRemove}
        className="flex-shrink-0 text-gray-400 hover:text-white 
                 transition-colors duration-200 p-1"
        aria-label="Закрыть уведомление"
      >
        <FiX className="h-4 w-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}