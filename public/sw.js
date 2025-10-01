// Service Worker для офлайн режима
const CACHE_NAME = 'military-focus-v1';
const STATIC_CACHE_NAME = 'military-focus-static-v1';

// Файлы для кэширования
const STATIC_FILES = [
  '/',
  '/offline.html',
  '/manifest.json',
];

// API endpoints для кэширования
const API_CACHE_PATTERNS = [
  /\/api\/feed/,
  /\/api\/articles/,
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Кэшируем статические файлы
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      }),
      // Пропускаем ожидание активации
      self.skipWaiting(),
    ])
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Очищаем старые кэши
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Берем контроль над всеми клиентами
      self.clients.claim(),
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
});

// Периодическая очистка кэша
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupCache());
  }
});

async function cleanupCache() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  const now = Date.now();
  
  for (const request of requests) {
    const response = await cache.match(request);
    const dateHeader = response?.headers.get('date');
    
    if (dateHeader) {
      const responseDate = new Date(dateHeader).getTime();
      // Удаляем записи старше 24 часов
      if (now - responseDate > 24 * 60 * 60 * 1000) {
        await cache.delete(request);
      }
    }
  }
}