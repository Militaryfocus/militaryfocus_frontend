// Регистрация Service Worker для офлайн режима
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker зарегистрирован:', registration);
      
      // Обработка обновлений
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Новый Service Worker установлен, показываем уведомление
              if (confirm('Доступно обновление приложения. Перезагрузить страницу?')) {
                window.location.reload();
              }
            }
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.error('Ошибка регистрации Service Worker:', error);
    }
  } else {
    console.log('Service Worker не поддерживается');
  }
};

// Проверка статуса подключения
export const checkOnlineStatus = () => {
  return navigator.onLine;
};

// Обработчик изменения статуса подключения
export const handleOnlineStatusChange = (callback: (isOnline: boolean) => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};