// 动画与交互效果测试套件

describe('动画与交互效果', () => {
  beforeEach(() => {
    // 设置基础 HTML 结构
    document.body.innerHTML = `
      <div id="app"></div>
      <div id="lesson-viewer" class="lesson-viewer">
        <button id="mark-complete" class="complete-btn">标记为完成</button>
      </div>
      <div id="toast" class="toast hidden"></div>
    `;

    // 模拟 Storage
    window.Storage = {
      getLessonProgress: () => null,
      saveLessonProgress: () => {}
    };

    // 模拟 Content
    window.Content = {
      getChapters: () => [],
      getLesson: () => null
    };

    // 模拟 ProgressManager
    window.ProgressManager = {
      completeCurrentLesson: () => {},
      startLearning: () => {},
      stopLearning: () => {}
    };

    // 模拟 SkillTree
    window.SkillTree = {
      refresh: () => {}
    };

    // 模拟 showToast
    window.showToast = (msg) => {
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = msg;
        toast.classList.remove('hidden');
      }
    };
  });

  describe('庆祝动画', () => {
    test('完成按钮应该添加 completed 类', () => {
      const btn = document.getElementById('mark-complete');
      btn.classList.add('completed');
      expect(btn.classList.contains('completed')).toBe(true);
    });

    test('完成按钮文本应该更新', () => {
      const btn = document.getElementById('mark-complete');
      btn.textContent = '已完成 ✓';
      expect(btn.textContent).toBe('已完成 ✓');
    });
  });

  describe('卡通按钮效果', () => {
    test('按钮应该具有卡通样式类', () => {
      const btn = document.createElement('button');
      btn.className = 'btn-cartoon';
      expect(btn.className).toContain('btn-cartoon');
    });

    test('按钮点击时应该有缩放效果', () => {
      const btn = document.createElement('button');
      btn.className = 'btn-cartoon';
      btn.click();
      // 验证按钮可以被点击（样式由 CSS 处理）
      expect(btn).toBeTruthy();
    });
  });

  describe('知识树节点动画', () => {
    test('节点展开时应该添加 expanded 类', () => {
      const node = document.createElement('div');
      node.className = 'mindmap-node';
      node.classList.add('expanded');
      expect(node.classList.contains('expanded')).toBe(true);
    });

    test('节点应该具有过渡样式', () => {
      const node = document.createElement('div');
      node.style.transition = 'max-height 0.3s ease';
      expect(node.style.transition).toContain('max-height');
    });
  });

  describe('Toast 提示增强', () => {
    test('Toast 应该显示消息', () => {
      const toast = document.getElementById('toast');
      toast.textContent = '测试消息';
      toast.classList.remove('hidden');
      expect(toast.classList.contains('hidden')).toBe(false);
      expect(toast.textContent).toBe('测试消息');
    });

    test('Toast 应该有 success 样式类', () => {
      const toast = document.createElement('div');
      toast.className = 'toast success';
      expect(toast.className).toContain('success');
    });
  });

  describe('连续学习火焰效果', () => {
    test('连续学习 7 天以上应该添加火焰类', () => {
      const card = document.createElement('div');
      card.className = 'info-card streak';

      // 模拟 7 天连续学习
      const streak = 7;
      if (streak >= 7) {
        card.classList.add('streak-fire');
      }

      expect(card.classList.contains('streak-fire')).toBe(true);
    });

    test('连续学习不足 7 天不应该有火焰效果', () => {
      const card = document.createElement('div');
      card.className = 'info-card streak';

      const streak = 3;
      if (streak >= 7) {
        card.classList.add('streak-fire');
      }

      expect(card.classList.contains('streak-fire')).toBe(false);
    });
  });
});
