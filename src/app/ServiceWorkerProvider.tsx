"use client";

import { useEffect } from 'react';
import { registerServiceWorker, handleOnlineStatusChange } from '@/utils/serviceWorker';
import { useToast } from '@/hooks/useToast';

export default function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const { info, warning } = useToast();

  useEffect(() => {
    // Регистрируем Service Worker
    registerServiceWorker();

    // Обрабатываем изменения статуса подключения
    const cleanup = handleOnlineStatusChange((isOnline) => {
      if (isOnline) {
        info('Подключение восстановлено', 'Вы снова в сети');
      } else {
        warning('Нет подключения', 'Вы работаете в офлайн режиме');
      }
    });

    return cleanup;
  }, [info, warning]);

  return <>{children}</>;
}