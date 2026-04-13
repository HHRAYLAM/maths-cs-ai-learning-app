// 庆祝效果工具 - 彩带粒子

const CelebrationEffect = {
  /**
   * 创建彩带庆祝效果
   * @param {number} duration - 持续时间（毫秒）
   */
  createConfetti(duration = 3000) {
    // 创建容器
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    // 创建 50 个彩带
    const colors = ['#FF3B30', '#FF9500', '#FFD93D', '#34C759', '#007AFF', '#AF52DE', '#FF2D55', '#5AC8FA'];

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.width = (Math.random() * 8 + 6) + 'px';
      confetti.style.height = (Math.random() * 8 + 6) + 'px';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(confetti);
    }

    // 移除容器
    setTimeout(() => {
      container.remove();
    }, duration);
  },

  /**
   * 创建星星爆炸效果
   * @param {number} x - X 坐标
   * @param {number} y - Y 坐标
   */
  createStars(x, y) {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);

    const starChars = ['⭐', '✨', '🌟', '💫'];

    for (let i = 0; i < 12; i++) {
      const star = document.createElement('div');
      star.textContent = starChars[Math.floor(Math.random() * starChars.length)];
      star.style.position = 'absolute';
      star.style.left = x + 'px';
      star.style.top = y + 'px';
      star.style.fontSize = (Math.random() * 16 + 16) + 'px';
      star.style.pointerEvents = 'none';

      // 随机方向
      const angle = (Math.PI * 2 * i) / 12;
      const velocity = Math.random() * 100 + 50;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      star.animate([
        {
          transform: 'translate(0, 0) scale(1)',
          opacity: 1
        },
        {
          transform: `translate(${tx}px, ${ty}px) scale(0)`,
          opacity: 0
        }
      ], {
        duration: 1000,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      });

      container.appendChild(star);
    }

    setTimeout(() => {
      container.remove();
    }, 1000);
  },

  /**
   * 创建成功礼花效果
   * @param {string} message - 祝贺消息
   */
  celebrate(message = '太棒了！') {
    // 创建祝贺横幅
    const banner = document.createElement('div');
    banner.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      background: linear-gradient(135deg, #FFD93D, #FF9500);
      color: white;
      padding: 24px 48px;
      border-radius: 24px;
      font-size: 28px;
      font-weight: 700;
      box-shadow: 0 20px 60px rgba(255, 217, 61, 0.5);
      z-index: 10000;
      text-align: center;
    `;
    banner.textContent = message;
    document.body.appendChild(banner);

    // 进入动画
    banner.animate([
      { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
      { transform: 'translate(-50%, -50%) scale(1.1)' },
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }
    ], {
      duration: 600,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    });

    // 创建彩带
    this.createConfetti();

    // 移除横幅
    setTimeout(() => {
      banner.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(0.8)', opacity: 0 }
      ], {
        duration: 300,
        easing: 'ease'
      }).onfinish = () => {
        banner.remove();
      };
    }, 2000);
  }
};

window.CelebrationEffect = CelebrationEffect;
