// Service Worker для офлайн режима Military Focus
const CACHE_NAME = 'military-focus-v2';
const STATIC_CACHE_NAME = 'military-focus-static-v2';
const IMAGE_CACHE_NAME = 'military-focus-images-v2';

// Файлы для кэширования
const STATIC_FILES = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.png',
];

// API endpoints для кэширования
const API_CACHE_PATTERNS = [
  /\/api\/feed/,
  /\/api\/articles/,
  /militaryfocus\.ru\/api/,
];

// Максимальный размер кэша (в байтах)
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB

// Время жизни кэша (в миллисекундах)
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 часа

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing v2...');
  
  event.waitUntil(
    Promise.all([
      // Кэшируем статические файлы
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      }),
      // Предварительно кэшируем важные ресурсы
      precacheImportantResources(),
      // Пропускаем ожидание активации
      self.skipWaiting(),
    ])
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating v2...');
  
  event.waitUntil(
    Promise.all([
      // Очищаем старые кэши
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes('v2')) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Берем контроль над всеми клиентами
      self.clients.claim(),
      // Управляем размером кэша
      manageCacheSize(),
    ])
  );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Пропускаем не-GET запросы
  if (request.method !== 'GET') {
    return;
  }

  // Стратегия для статических файлов
  if (STATIC_FILES.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).catch(() => {
          // Возвращаем офлайн страницу для главной страницы
          if (url.pathname === '/') {
            return caches.match('/offline.html');
          }
          return new Response('Offline', { status: 503 });
        });
      })
    );
    return;
  }

  // Стратегия для API запросов
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Service Worker: Serving from cache:', url.pathname);
            return cachedResponse;
          }

          return fetch(request).then((networkResponse) => {
            // Кэшируем успешные ответы
            if (networkResponse.status === 200) {
              console.log('Service Worker: Caching API response:', url.pathname);
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Возвращаем кэшированный ответ при ошибке сети
            return cachedResponse || new Response(
              JSON.stringify({ 
                error: 'Offline', 
                message: 'Нет подключения к интернету' 
              }),
              { 
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
        });
      })
    );
    return;
  }

  // Стратегия для других ресурсов (изображения, CSS, JS)
  if (request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'script') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Возвращаем заглушку для изображений
          if (request.destination === 'image') {
            return new Response(
              '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" fill="#6b7280">Изображение недоступно</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          }
          return new Response('Resource not available offline', { status: 503 });
        });
      })
    );
  }
});

// Обработка сообщений от клиента
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls;
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urls);
      })
    );
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearAllCaches());
  }

  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    event.waitUntil(getCacheSize().then(size => {
      event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
    }));
  }
});

// Обработка push уведомлений
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push event received');
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Military Focus', body: event.data.text() };
    }
  }

  const options = {
    body: data.body || 'Новая важная новость',
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    tag: data.tag || 'military-focus-news',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [
      {
        action: 'open',
        title: 'Открыть'
      },
      {
        action: 'dismiss',
        title: 'Закрыть'
      }
    ],
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Military Focus', options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Если приложение уже открыто, фокусируемся на нем
        for (const client of clientList) {
          if (client.url === event.notification.data?.url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Иначе открываем новое окно
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data?.url || '/');
        }
      })
    );
  }
});

// Обработка закрытия уведомлений
self.addEventListener('notificationclose', (event) => {
  console.log('Service Worker: Notification closed');
  // Можно добавить аналитику закрытия уведомлений
});

// Периодическая очистка кэша
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupCache());
  }
});

// Вспомогательные функции
async function cleanupCache() {
  console.log('Service Worker: Cleaning up cache...');
  
  const cacheNames = [CACHE_NAME, STATIC_CACHE_NAME, IMAGE_CACHE_NAME];
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    const now = Date.now();
    
    for (const request of requests) {
      const response = await cache.match(request);
      const dateHeader = response?.headers.get('date');
      
      if (dateHeader) {
        const responseDate = new Date(dateHeader).getTime();
        // Удаляем записи старше установленного времени
        if (now - responseDate > CACHE_EXPIRY_TIME) {
          await cache.delete(request);
        }
      }
    }
  }
}

async function clearAllCaches() {
  console.log('Service Worker: Clearing all caches...');
  
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

async function manageCacheSize() {
  const currentSize = await getCacheSize();
  
  if (currentSize > MAX_CACHE_SIZE) {
    console.log('Service Worker: Cache size exceeded, cleaning up...');
    await cleanupCache();
  }
}

// Функция для предварительного кэширования важных ресурсов
async function precacheImportantResources() {
  const importantUrls = [
    '/',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    '/offline.html'
  ];
  
  const cache = await caches.open(STATIC_CACHE_NAME);
  
  for (const url of importantUrls) {
    try {
      await cache.add(url);
      console.log('Service Worker: Precached', url);
    } catch (error) {
      console.warn('Service Worker: Failed to precache', url, error);
    }
  }
}