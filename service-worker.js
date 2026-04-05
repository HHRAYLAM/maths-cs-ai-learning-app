// Service Worker - 离线缓存支持
const CACHE_NAME = 'math-cs-ai-learning-v2';
const BASE_PATH = '/maths-cs-ai-learning-app';

// 核心资源（立即缓存）
const CORE_CACHE = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/css/main.css`,
  `${BASE_PATH}/css/skill-tree.css`,
  `${BASE_PATH}/css/lesson.css`,
  `${BASE_PATH}/css/dependency.css`,
  `${BASE_PATH}/js/storage.js`,
  `${BASE_PATH}/js/content.js`,
  `${BASE_PATH}/js/progress.js`,
  `${BASE_PATH}/js/skill-tree.js`,
  `${BASE_PATH}/js/dependency.js`,
  `${BASE_PATH}/js/lesson.js`,
  `${BASE_PATH}/js/app.js`,
  `${BASE_PATH}/js/quiz.js`,
  `${BASE_PATH}/js/service-worker-register.js`
];

// 安装事件 - 缓存核心资源
self.addEventListener('install', event => {
  console.log('Service Worker 开始安装...');
  event.waitUntil(
    caches.open(CACHE_NAME + '-core')
      .then(cache => {
        console.log('缓存核心资源...');
        return cache.addAll(CORE_CACHE);
      })
      .then(() => {
        console.log('核心资源缓存完成');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('核心资源缓存失败:', err);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  console.log('Service Worker 开始激活...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME + '-core' && cacheName !== CACHE_NAME + '-content') {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker 激活完成');
      return self.clients.claim();
    })
  );
});

// 请求拦截 - 缓存优先，其次网络
self.addEventListener('fetch', event => {
  // 只处理 HTTP/HTTPS 请求
  if (!event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);
  const isContentRequest = url.pathname.includes('/content/');
  const isExternalResource = url.hostname !== self.location.hostname;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // 缓存命中，直接返回
          console.log('缓存命中:', event.request.url);
          return cachedResponse;
        }

        // 缓存未命中，从网络获取
        return fetch(event.request)
          .then(networkResponse => {
            // 不缓存非 GET 请求或错误响应
            if (!networkResponse || networkResponse.status !== 200 || event.request.method !== 'GET') {
              return networkResponse;
            }

            // 克隆响应
            const responseToCache = networkResponse.clone();
            const cacheName = isContentRequest ? CACHE_NAME + '-content' : CACHE_NAME + '-core';

            // 缓存新获取的资源
            caches.open(cacheName)
              .then(cache => {
                cache.put(event.request, responseToCache);
                console.log('缓存新资源:', event.request.url);
              })
              .catch(err => {
                console.error('缓存资源失败:', err, event.request.url);
              });

            return networkResponse;
          })
          .catch(error => {
            // 网络失败，返回离线页面
            console.error('网络请求失败:', error);
            if (event.request.destination === 'document') {
              return caches.match(`${BASE_PATH}/index.html`);
            }
            return new Response('离线模式，资源不可用', {
              status: 503,
              statusText: 'Offline'
            });
          });
      })
  );
});
