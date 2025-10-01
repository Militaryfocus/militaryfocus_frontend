"use client";

import { useEffect, useState } from 'react';

interface ErrorInfo {
  message: string;
  stack?: string;
  url?: string;
  line?: number;
  column?: number;
  timestamp: string;
  userAgent: string;
  userId?: string;
}

interface ErrorMonitorProps {
  onError?: (error: ErrorInfo) => void;
  reportErrors?: boolean;
  maxErrors?: number;
}

export default function ErrorMonitor({
  onError,
  reportErrors = true,
  maxErrors = 50,
}: ErrorMonitorProps) {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (!reportErrors) return;

    const handleError = (event: ErrorEvent) => {
      const errorInfo: ErrorInfo = {
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        line: event.lineno,
        column: event.colno,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

      setErrors(prev => {
        const newErrors = [errorInfo, ...prev].slice(0, maxErrors);
        return newErrors;
      });

      onError?.(errorInfo);

      // Логируем ошибку в консоль для отладки
      console.error('JavaScript Error:', errorInfo);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorInfo: ErrorInfo = {
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

      setErrors(prev => {
        const newErrors = [errorInfo, ...prev].slice(0, maxErrors);
        return newErrors;
      });

      onError?.(errorInfo);

      console.error('Unhandled Promise Rejection:', errorInfo);
    };

    // Глобальные обработчики ошибок
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    setIsEnabled(true);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [onError, reportErrors, maxErrors]);

  // Функция для отправки ошибок на сервер
  const reportError = async (error: ErrorInfo) => {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      });
    } catch (err) {
      console.error('Failed to report error:', err);
    }
  };

  // Используем функцию для автоматической отправки ошибок
  useEffect(() => {
    if (errors.length > 0) {
      errors.forEach(error => reportError(error));
    }
  }, [errors]);

  // Функция для очистки ошибок
  const clearErrors = () => {
    setErrors([]);
  };

  // Функция для экспорта ошибок
  const exportErrors = () => {
    const dataStr = JSON.stringify(errors, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `errors-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs text-white z-50 max-w-sm">
      <div className="font-semibold mb-2 flex items-center justify-between">
        <span>Мониторинг ошибок</span>
        <div className="flex gap-1">
          <button
            onClick={clearErrors}
            className="text-gray-400 hover:text-white transition-colors"
            title="Очистить ошибки"
          >
            🗑️
          </button>
          <button
            onClick={exportErrors}
            className="text-gray-400 hover:text-white transition-colors"
            title="Экспортировать ошибки"
          >
            📤
          </button>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Всего ошибок:</span>
          <span className={`font-bold ${
            errors.length === 0 ? 'text-green-400' :
            errors.length < 5 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {errors.length}
          </span>
        </div>
        
        {errors.length > 0 && (
          <div className="max-h-32 overflow-y-auto">
            {errors.slice(0, 3).map((error, index) => (
              <div key={index} className="text-xs text-gray-300 border-l-2 border-red-500 pl-2 mb-1">
                <div className="font-medium truncate">{error.message}</div>
                <div className="text-gray-500">
                  {new Date(error.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {errors.length > 3 && (
              <div className="text-gray-500 text-center">
                ... и еще {errors.length - 3} ошибок
              </div>
            )}
          </div>
        )}
        
        {errors.length === 0 && (
          <div className="text-green-400 text-center">
            ✅ Ошибок не обнаружено
          </div>
        )}
      </div>
    </div>
  );
}