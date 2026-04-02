// Service Worker - 离线缓存支持
const CACHE_NAME = 'math-cs-ai-learning-v1';
const BASE_PATH = '/maths-cs-ai-learning-app';
const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/css/main.css`,
  `${BASE_PATH}/css/skill-tree.css`,
  `${BASE_PATH}/css/lesson.css`,
  `${BASE_PATH}/js/storage.js`,
  `${BASE_PATH}/js/content.js`,
  `${BASE_PATH}/js/progress.js`,
  `${BASE_PATH}/js/skill-tree.js`,
  `${BASE_PATH}/js/dependency.js`,
  `${BASE_PATH}/js/lesson.js`,
  `${BASE_PATH}/js/app.js`,
  `${BASE_PATH}/js/quiz.js`,
  `${BASE_PATH}/js/service-worker-register.js`,
  `${BASE_PATH}/content/math-cs-ai/chapters.json`
];

// 安装事件 - 缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('缓存失败:', err);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 请求拦截 - 优先缓存，其次网络
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            // 不缓存非 GET 请求或错误响应
            if (!response || response.status !== 200 || event.request.method !== 'GET') {
              return response;
            }
            // 克隆响应
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});
