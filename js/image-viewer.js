// 图片查看器 - Lightbox 效果和卡通风格

const ImageViewer = {
  // 初始化图片点击事件
  init() {
    // 监听课程内容区域的图片点击
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG' && e.target.closest('#lesson-content')) {
        this.openLightbox(e.target);
      }
    });

    //  ESC 键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeLightbox();
      }
    });
  },

  // 打开 Lightbox
  openLightbox(img) {
    const modal = document.getElementById('image-lightbox');
    if (!modal) {
      this.createLightbox();
    }

    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');

    if (lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '示意图';
    }

    if (lightboxCaption && img.alt) {
      lightboxCaption.textContent = img.alt;
    }

    if (lightbox) {
      lightbox.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  },

  // 关闭 Lightbox
  closeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox) {
      lightbox.classList.add('hidden');
      document.body.style.overflow = '';
    }
  },

  // 创建 Lightbox HTML
  createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'image-lightbox';
    lightbox.className = 'lightbox hidden';
    lightbox.innerHTML = `
      <div class="lightbox-overlay" onclick="ImageViewer.closeLightbox()"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" onclick="ImageViewer.closeLightbox()">✕</button>
        <img id="lightbox-image" src="" alt="">
        <div id="lightbox-caption" class="lightbox-caption"></div>
        <button class="lightbox-nav prev" onclick="ImageViewer.navigate(-1)">‹</button>
        <button class="lightbox-nav next" onclick="ImageViewer.navigate(1)">›</button>
      </div>
    `;
    document.body.appendChild(lightbox);
  },

  // 导航图片（预留功能）
  navigate(direction) {
    // TODO: 实现图片导航
    console.log('Navigate', direction);
  }
};

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
  ImageViewer.init();
});

// 导出到全局
window.ImageViewer = ImageViewer;
