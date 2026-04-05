// PWA 安装提示和离线缓存管理

const PWAManager = {
  // 延迟提示元素
  deferredPrompt: null,
  installButton: null,

  // 初始化
  init() {
    console.log('PWA 管理器初始化...');

    // 监听安装提示
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA 安装提示触发');
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallBanner();
    });

    // 监听安装成功
    window.addEventListener('appinstalled', () => {
      console.log('PWA 已安装');
      this.hideInstallBanner();
      this.deferredPrompt = null;
    });

    // 检查是否需要缓存内容
    this.checkContentCache();
  },

  // 显示安装横幅
  showInstallBanner() {
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.className = 'pwa-install-banner hidden';
    banner.innerHTML = `
      <div class="banner-content">
        <div class="banner-icon">📲</div>
        <div class="banner-text">
          <div class="banner-title">安装应用</div>
          <div class="banner-desc">添加到主屏幕，离线学习更方便</div>
        </div>
        <button class="banner-install-btn">安装</button>
        <button class="banner-close-btn">×</button>
      </div>
    `;
    document.body.appendChild(banner);

    // 绑定事件
    setTimeout(() => {
      banner.classList.remove('hidden');
    }, 1000);

    banner.querySelector('.banner-install-btn').addEventListener('click', () => {
      this.install();
    });

    banner.querySelector('.banner-close-btn').addEventListener('click', () => {
      this.hideInstallBanner();
    });
  },

  hideInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.classList.add('hidden');
      setTimeout(() => banner.remove(), 300);
    }
  },

  // 安装应用
  async install() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    console.log('用户选择:', outcome);
    this.deferredPrompt = null;
    this.hideInstallBanner();
  },

  // 检查内容缓存
  async checkContentCache() {
    if (!('caches' in window)) return;

    const cacheName = 'math-cs-ai-learning-v2-content';
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    // 如果缓存的内容很少，提示用户预缓存
    if (keys.length < 10) {
      this.showCacheHint();
    }
  },

  // 显示缓存提示
  showCacheHint() {
    const hint = document.createElement('div');
    hint.id = 'pwa-cache-hint';
    hint.className = 'pwa-cache-hint hidden';
    hint.innerHTML = `
      <div class="hint-content">
        <div class="hint-icon">💾</div>
        <div class="hint-text">
          <div class="hint-title">离线学习准备</div>
          <div class="hint-desc">点击"一键缓存"，飞机上也能学习</div>
        </div>
        <button class="hint-cache-btn">一键缓存</button>
        <button class="hint-close-btn">×</button>
      </div>
    `;
    document.body.appendChild(hint);

    setTimeout(() => {
      hint.classList.remove('hidden');
    }, 3000);

    hint.querySelector('.hint-cache-btn').addEventListener('click', () => {
      this.cacheAllContent();
      hint.classList.add('hidden');
    });

    hint.querySelector('.hint-close-btn').addEventListener('click', () => {
      hint.classList.add('hidden');
    });
  },

  // 缓存所有内容
  async cacheAllContent() {
    const toast = document.createElement('div');
    toast.id = 'pwa-cache-toast';
    toast.className = 'pwa-cache-toast';
    toast.textContent = '正在缓存内容...';
    document.body.appendChild(toast);

    try {
      // 获取所有章节
      const chapters = Content.getChapters();
      let cached = 0;
      let total = 0;

      // 计算总课程数
      for (const chapter of chapters) {
        total += chapter.lessons?.length || 0;
      }

      // 缓存所有课程内容
      for (const chapter of chapters) {
        for (const lesson of (chapter.lessons || [])) {
          if (lesson.file) {
            try {
              const response = await fetch(`content/math-cs-ai/${lesson.file}`);
              if (response.ok) {
                const cache = await caches.open('math-cs-ai-learning-v2-content');
                await cache.put(response.url, response.clone());
                cached++;
                toast.textContent = `正在缓存... ${cached}/${total}`;
              }
            } catch (e) {
              console.error('缓存失败:', lesson.title, e);
            }
          }
        }
      }

      toast.textContent = `✓ 已缓存 ${cached} 节课程，可以离线学习了！`;
      toast.classList.add('success');

      setTimeout(() => toast.remove(), 3000);

      // 隐藏缓存提示
      const hint = document.getElementById('pwa-cache-hint');
      if (hint) hint.classList.add('hidden');

    } catch (error) {
      console.error('缓存出错:', error);
      toast.textContent = '缓存失败，请重试';
      toast.classList.add('error');
    }
  }
};

// 自动初始化
if (typeof Content !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => PWAManager.init(), 2000);
  });
}
