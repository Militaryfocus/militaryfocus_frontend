"use client";

import { useState, useEffect } from 'react';
import { FiWifi, FiWifiOff, FiDownload, FiBell, FiBellOff, FiTrash2, FiRefreshCw, FiInfo } from 'react-icons/fi';

interface PWAManagerProps {
  className?: string;
}

export default function PWAManager({ className = '' }: PWAManagerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Проверяем статус подключения
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Проверяем, установлено ли PWA
    const checkPWAStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInApp = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInApp);
    };

    // Проверяем разрешения на уведомления
    const checkNotificationPermission = () => {
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
    };

    // Получаем регистрацию Service Worker
    const getSWRegistration = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          setSwRegistration(registration || null);
        } catch (error) {
          console.error('Ошибка получения Service Worker:', error);
        }
      }
    };

    // Получаем размер кэша
    const getCacheSize = async () => {
      if ('serviceWorker' in navigator && swRegistration?.active) {
        try {
          const messageChannel = new MessageChannel();
          const promise = new Promise<number>((resolve) => {
            messageChannel.port1.onmessage = (event) => {
              if (event.data.type === 'CACHE_SIZE') {
                resolve(event.data.size);
              }
            };
          });

          swRegistration.active.postMessage(
            { type: 'GET_CACHE_SIZE' },
            [messageChannel.port2]
          );

          const size = await promise;
          setCacheSize(size);
        } catch (error) {
          console.error('Ошибка получения размера кэша:', error);
        }
      }
    };

    // Инициализация
    updateOnlineStatus();
    checkPWAStatus();
    checkNotificationPermission();
    getSWRegistration().then(() => {
      getCacheSize();
    });

    // Слушатели событий
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => {
      checkPWAStatus();
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, [swRegistration]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        
        if (permission === 'granted' && swRegistration) {
          // Показываем тестовое уведомление
          swRegistration.showNotification('Military Focus', {
            body: 'Уведомления включены! Теперь вы будете получать важные новости.',
            icon: '/icon-192.png',
            badge: '/icon-96.png',
            tag: 'notification-enabled',
            requireInteraction: false
          });
        }
      } catch (error) {
        console.error('Ошибка запроса разрешения на уведомления:', error);
      }
    }
  };

  const sendTestNotification = async () => {
    if (notificationPermission === 'granted' && swRegistration) {
      try {
        await swRegistration.showNotification('Military Focus - Тест', {
          body: 'Это тестовое уведомление. Все работает корректно!',
          icon: '/icon-192.png',
          badge: '/icon-96.png',
          tag: 'test-notification',
          requireInteraction: false
        });
      } catch (error) {
        console.error('Ошибка отправки уведомления:', error);
      }
    }
  };

  const clearCache = async () => {
    if (swRegistration?.active) {
      setIsLoading(true);
      try {
        const messageChannel = new MessageChannel();
        const promise = new Promise<void>((resolve) => {
          messageChannel.port1.onmessage = () => {
            resolve();
          };
        });

        swRegistration.active.postMessage(
          { type: 'CLEAR_CACHE' },
          [messageChannel.port2]
        );

        await promise;
        setCacheSize(0);
        
        // Показываем уведомление об успехе
        if (notificationPermission === 'granted') {
          swRegistration.showNotification('Кэш очищен', {
            body: 'Все кэшированные данные удалены',
            icon: '/icon-192.png',
            tag: 'cache-cleared'
          });
        }
      } catch (error) {
        console.error('Ошибка очистки кэша:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const refreshCache = async () => {
    if (swRegistration?.active) {
      setIsLoading(true);
      try {
        // Обновляем Service Worker
        await swRegistration.update();
        
        // Показываем уведомление
        if (notificationPermission === 'granted') {
          swRegistration.showNotification('Кэш обновлен', {
            body: 'Service Worker обновлен до последней версии',
            icon: '/icon-192.png',
            tag: 'cache-updated'
          });
        }
      } catch (error) {
        console.error('Ошибка обновления кэша:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`pwa-manager ${className}`}>
      <div className="bg-gradient-to-r from-green-800 to-green-900 rounded-lg p-4 text-white glass-effect">
        <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
          <FiInfo size={20} />
          <span>PWA Статус</span>
        </h3>

        {/* Статус подключения */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <FiWifi className="text-green-400" size={20} />
            ) : (
              <FiWifiOff className="text-red-400" size={20} />
            )}
            <span className="text-sm">
              {isOnline ? 'Онлайн' : 'Офлайн'}
            </span>
          </div>
          <div className="text-xs text-green-200">
            {isOnline ? 'Подключено к интернету' : 'Работа в офлайн режиме'}
          </div>
        </div>

        {/* Статус PWA */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FiDownload className={isInstalled ? "text-blue-400" : "text-gray-400"} size={20} />
            <span className="text-sm">
              PWA {isInstalled ? 'установлен' : 'не установлен'}
            </span>
          </div>
          {isInstalled && (
            <div className="text-xs text-blue-200">
              Приложение установлено
            </div>
          )}
        </div>

        {/* Статус уведомлений */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {notificationPermission === 'granted' ? (
              <FiBell className="text-green-400" size={20} />
            ) : (
              <FiBellOff className="text-yellow-400" size={20} />
            )}
            <span className="text-sm">
              Уведомления {notificationPermission === 'granted' ? 'включены' : 'отключены'}
            </span>
          </div>
          {notificationPermission === 'granted' && (
            <button
              onClick={sendTestNotification}
              className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
            >
              Тест
            </button>
          )}
        </div>

        {/* Размер кэша */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">Размер кэша:</span>
          <span className="text-sm font-mono">{formatBytes(cacheSize)}</span>
        </div>

        {/* Кнопки управления */}
        <div className="space-y-2">
          {notificationPermission !== 'granted' && (
            <button
              onClick={requestNotificationPermission}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-green-900 font-semibold py-2 px-3 rounded-md text-sm transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <FiBell size={16} />
              <span>Включить уведомления</span>
            </button>
          )}

          <div className="flex space-x-2">
            <button
              onClick={refreshCache}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-3 rounded-md text-sm transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <FiRefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span>Обновить</span>
            </button>

            <button
              onClick={clearCache}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 text-white font-semibold py-2 px-3 rounded-md text-sm transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <FiTrash2 size={16} />
              <span>Очистить</span>
            </button>
          </div>
        </div>

        {/* Информация о Service Worker */}
        {swRegistration && (
          <div className="mt-3 pt-3 border-t border-green-600">
            <div className="text-xs text-green-200">
              Service Worker: {swRegistration.active ? 'Активен' : 'Неактивен'}
            </div>
            <div className="text-xs text-green-200">
              Версия: v2
            </div>
          </div>
        )}
      </div>
    </div>
  );
}