"use client";

import { useState, useEffect } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Проверяем, установлено ли приложение
    const checkIfInstalled = () => {
      // Проверяем различные индикаторы установки PWA
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInApp = (window.navigator as any).standalone === true; // iOS Safari
      const isInstalled = isStandalone || isInApp;
      
      setIsInstalled(isInstalled);
      
      // Показываем кнопку только если не установлено
      if (!isInstalled) {
        setShowInstallButton(true);
      }
    };

    checkIfInstalled();

    // Слушаем событие beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    // Слушаем событие appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
      
      // Показываем уведомление об успешной установке
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification('Military Focus установлен!', {
              body: 'Приложение успешно установлено на ваше устройство',
              icon: '/icon-192.png',
              badge: '/icon-96.png',
              tag: 'pwa-installed',
              requireInteraction: false
            });
          });
        }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Проверяем изменения в display-mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => {
      checkIfInstalled();
    };
    
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback для браузеров без поддержки beforeinstallprompt
      alert('Для установки приложения используйте меню браузера:\n\nChrome: ⋮ → "Установить Military Focus"\nEdge: ⋯ → "Приложения" → "Установить это приложение"\nSafari: Поделиться → "На экран \"Домой\""');
      return;
    }

    try {
      // Показываем диалог установки
      await deferredPrompt.prompt();
      
      // Ждем выбора пользователя
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('Пользователь принял установку PWA');
      } else {
        console.log('Пользователь отклонил установку PWA');
      }
      
      // Очищаем промпт
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Ошибка при установке PWA:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    // Сохраняем в localStorage, что пользователь отклонил установку
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Не показываем кнопку, если пользователь уже отклонил установку
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed === 'true') {
      setShowInstallButton(false);
    }
  }, []);

  if (!showInstallButton || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-green-800 to-green-900 text-white p-4 rounded-lg shadow-2xl border border-green-600 max-w-sm glass-effect">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-green-900 font-bold text-sm">MF</span>
            </div>
            <div>
              <h3 className="font-bold text-sm">Установить Military Focus</h3>
              <p className="text-xs text-green-200">Быстрый доступ к новостям</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-green-300 hover:text-white transition-colors"
            aria-label="Закрыть"
          >
            <FiX size={16} />
          </button>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-green-200">
            Установите приложение для быстрого доступа к новостям СВО, даже без интернета.
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-green-900 font-semibold py-2 px-3 rounded-md text-xs transition-all duration-200 flex items-center justify-center space-x-1"
            >
              <FiDownload size={14} />
              <span>Установить</span>
            </button>
            
            <button
              onClick={handleDismiss}
              className="px-3 py-2 text-green-300 hover:text-white text-xs transition-colors"
            >
              Позже
            </button>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-green-300">
          ✨ Офлайн режим • 🔔 Уведомления • 📱 Быстрый доступ
        </div>
      </div>
    </div>
  );
}