"use client";

import { useState, useEffect } from 'react';
import { FiWifi, FiWifiOff, FiDownload, FiBell, FiBellOff } from 'react-icons/fi';

interface PWAStatusProps {
  className?: string;
}

export default function PWAStatus({ className = '' }: PWAStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

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

    // Инициализация
    updateOnlineStatus();
    checkPWAStatus();
    checkNotificationPermission();
    getSWRegistration();

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
  }, []);

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

  if (!className) {
    return null; // Скрытый компонент для получения статуса
  }

  return (
    <div className={`pwa-status ${className}`}>
      {/* Статус подключения */}
      <div className="flex items-center space-x-2 text-sm">
        {isOnline ? (
          <div className="flex items-center space-x-1 text-green-400">
            <FiWifi size={16} />
            <span>Онлайн</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-red-400">
            <FiWifiOff size={16} />
            <span>Офлайн</span>
          </div>
        )}
      </div>

      {/* Статус PWA */}
      {isInstalled && (
        <div className="flex items-center space-x-1 text-blue-400 text-sm">
          <FiDownload size={16} />
          <span>PWA установлен</span>
        </div>
      )}

      {/* Статус уведомлений */}
      <div className="flex items-center space-x-2">
        {notificationPermission === 'granted' ? (
          <div className="flex items-center space-x-1 text-green-400 text-sm">
            <FiBell size={16} />
            <span>Уведомления включены</span>
            <button
              onClick={sendTestNotification}
              className="ml-2 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
            >
              Тест
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-yellow-400 text-sm">
            <FiBellOff size={16} />
            <span>Уведомления отключены</span>
            <button
              onClick={requestNotificationPermission}
              className="ml-2 px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors"
            >
              Включить
            </button>
          </div>
        )}
      </div>

      {/* Информация о Service Worker */}
      {swRegistration && (
        <div className="text-xs text-gray-400 mt-1">
          SW: {swRegistration.active ? 'Активен' : 'Неактивен'}
        </div>
      )}
    </div>
  );
}

// Хук для использования PWA статуса в других компонентах
export function usePWAStatus() {
  const [status, setStatus] = useState({
    isOnline: true,
    isInstalled: false,
    notificationPermission: 'default' as NotificationPermission,
    swRegistration: null as ServiceWorkerRegistration | null
  });

  useEffect(() => {
    const updateStatus = () => {
      const isOnline = navigator.onLine;
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInApp = (window.navigator as any).standalone === true;
      const isInstalled = isStandalone || isInApp;
      const notificationPermission = 'Notification' in window ? Notification.permission : 'default';

      setStatus(prev => ({
        ...prev,
        isOnline,
        isInstalled,
        notificationPermission
      }));
    };

    updateStatus();

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', updateStatus);

    // Получаем Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        setStatus(prev => ({
          ...prev,
          swRegistration: registration || null
        }));
      });
    }

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      mediaQuery.removeEventListener('change', updateStatus);
    };
  }, []);

  return status;
}