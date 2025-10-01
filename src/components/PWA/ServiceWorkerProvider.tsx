"use client";

import { useEffect, useState } from 'react';

interface ServiceWorkerRegistrationHook {
  registration: ServiceWorkerRegistration | null;
  isSupported: boolean;
  isInstalled: boolean;
  updateAvailable: boolean;
  updateServiceWorker: () => void;
  unregisterServiceWorker: () => Promise<boolean>;
}

export function useServiceWorker(): ServiceWorkerRegistrationHook {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Проверяем поддержку Service Worker
    if ('serviceWorker' in navigator) {
      setIsSupported(true);
      
      // Регистрируем Service Worker
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('Service Worker зарегистрирован:', reg);
          setRegistration(reg);
          setIsInstalled(true);

          // Проверяем обновления
          reg.addEventListener('updatefound', () => {
            console.log('Найдено обновление Service Worker');
            setUpdateAvailable(true);
          });

          // Проверяем, есть ли ожидающий Service Worker
          if (reg.waiting) {
            setUpdateAvailable(true);
          }

          // Слушаем сообщения от Service Worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data.type === 'SW_UPDATE_AVAILABLE') {
              setUpdateAvailable(true);
            }
          });
        })
        .catch((error) => {
          console.error('Ошибка регистрации Service Worker:', error);
          setIsInstalled(false);
        });
    } else {
      console.log('Service Worker не поддерживается');
      setIsSupported(false);
    }
  }, []);

  const updateServiceWorker = () => {
    if (registration?.waiting) {
      // Сообщаем ожидающему Service Worker, что нужно обновиться
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Перезагружаем страницу после обновления
      registration.waiting.addEventListener('statechange', (e) => {
        if ((e.target as ServiceWorker).state === 'activated') {
          window.location.reload();
        }
      });
    }
  };

  const unregisterServiceWorker = async (): Promise<boolean> => {
    if (registration) {
      try {
        const result = await registration.unregister();
        console.log('Service Worker отключен:', result);
        setRegistration(null);
        setIsInstalled(false);
        return result;
      } catch (error) {
        console.error('Ошибка отключения Service Worker:', error);
        return false;
      }
    }
    return false;
  };

  return {
    registration,
    isSupported,
    isInstalled,
    updateAvailable,
    updateServiceWorker,
    unregisterServiceWorker
  };
}

// Компонент для автоматической регистрации Service Worker
export default function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const { isSupported, isInstalled, updateAvailable, updateServiceWorker } = useServiceWorker();
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  useEffect(() => {
    // Показываем уведомление об обновлении
    if (updateAvailable) {
      setShowUpdateBanner(true);
      
      const showUpdateNotification = () => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Military Focus - Обновление доступно', {
            body: 'Доступна новая версия приложения. Нажмите для обновления.',
            icon: '/icon-192.png',
            tag: 'sw-update',
            requireInteraction: true
          });
        }
      };

      // Показываем уведомление через 3 секунды
      const timer = setTimeout(showUpdateNotification, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateAvailable]);

  return (
    <>
      {children}
      
      {/* Баннер обновления */}
      {showUpdateBanner && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 z-50 animate-slide-down">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xs">🔄</span>
              </div>
              <span className="text-sm font-medium">
                Доступно обновление приложения
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={updateServiceWorker}
                className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                Обновить
              </button>
              <button
                onClick={() => setShowUpdateBanner(false)}
                className="text-white/80 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Информация о Service Worker в development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-20 left-4 bg-black/80 text-white p-2 rounded text-xs z-40">
          SW: {isSupported ? (isInstalled ? '✅' : '❌') : '🚫'}
          {updateAvailable && ' | 🔄 Update'}
        </div>
      )}
    </>
  );
}