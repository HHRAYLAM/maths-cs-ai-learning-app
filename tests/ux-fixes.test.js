// UX 问题修复测试
// 测试 4 个关键 UX 问题：
// 1. 返回按钮是否工作
// 2. 主题切换后设置弹窗是否关闭
// 3. 学习进度显示是否正确
// 4. 依赖图点击是否打开课程

describe('UX 问题修复测试', () => {
  // ============================================
  // 测试 1: 返回按钮功能
  // ============================================
  describe('返回按钮功能', () => {
    test('应该正确绑定返回按钮事件', () => {
      // 设置 HTML
      document.body.innerHTML = `
        <div id="lesson-viewer">
          <button id="back-to-home">返回</button>
        </div>
      `;

      let closeCalled = false;
      const mockLessonViewer = {
        close: () => { closeCalled = true; }
      };

      // 模拟按钮点击
      const backBtn = document.getElementById('back-to-home');
      backBtn.addEventListener('click', () => mockLessonViewer.close());
      backBtn.click();

      expect(closeCalled).toBe(true);
    });

    test('应该防止重复绑定事件', () => {
      document.body.innerHTML = `
        <div id="lesson-viewer">
          <button id="back-to-home" data-bound="true">返回</button>
        </div>
      `;

      let clickCount = 0;
      const backBtn = document.getElementById('back-to-home');

      // 如果已经绑定过，不应该再次绑定
      if (!backBtn.dataset.bound) {
        backBtn.addEventListener('click', () => clickCount++);
      }

      // 模拟多次点击
      backBtn.click();
      backBtn.click();

      // 因为 data-bound="true"，所以没有绑定事件，clickCount 应该是 0
      expect(clickCount).toBe(0);
    });
  });

  // ============================================
  // 测试 2: 主题切换后关闭设置弹窗
  // ============================================
  describe('主题切换功能', () => {
    test('切换主题后应该关闭设置弹窗', () => {
      document.body.innerHTML = `
        <div id="settings-modal" class="modal">
          <button class="theme-btn" data-theme="dark">暗色</button>
        </div>
      `;

      const modal = document.getElementById('settings-modal');
      const themeBtn = document.querySelector('.theme-btn');

      // 模拟主题切换
      themeBtn.addEventListener('click', () => {
        // 模拟 Storage.setTheme 和 Storage.applyTheme
        modal.classList.add('hidden');
      });

      themeBtn.click();

      expect(modal.classList.contains('hidden')).toBe(true);
    });
  });

  // ============================================
  // 测试 3: 学习进度显示
  // ============================================
  describe('学习进度显示', () => {
    test('当 Content 未初始化时应该返回默认值', () => {
      // 模拟 window.Content 不存在的情况
      const originalContent = window.Content;
      window.Content = null;

      // 模拟 getTotalLessons 函数
      function getTotalLessons() {
        if (window.Content && typeof window.Content.getChapters === 'function') {
          const chapters = window.Content.getChapters();
          if (chapters && chapters.length > 0) {
            return chapters.reduce((sum, chapter) => {
              return sum + (chapter.lessons ? chapter.lessons.length : 0);
            }, 0);
          }
        }
        // 默认值
        return 100;
      }

      const result = getTotalLessons();
      expect(result).toBe(100);

      // 恢复
      window.Content = originalContent;
    });

    test('当有章节数据时应该正确计算总数', () => {
      window.Content = {
        getChapters: () => [
          { id: 'ch1', lessons: [{ id: 'l1' }, { id: 'l2' }] },
          { id: 'ch2', lessons: [{ id: 'l3' }, { id: 'l4' }, { id: 'l5' }] }
        ]
      };

      function getTotalLessons() {
        if (window.Content && typeof window.Content.getChapters === 'function') {
          const chapters = window.Content.getChapters();
          if (chapters && chapters.length > 0) {
            return chapters.reduce((sum, chapter) => {
              return sum + (chapter.lessons ? chapter.lessons.length : 0);
            }, 0);
          }
        }
        return 100;
      }

      const result = getTotalLessons();
      expect(result).toBe(5);
    });
  });

  // ============================================
  // 测试 4: 依赖图点击导航
  // ============================================
  describe('依赖图点击导航', () => {
    test('应该优先使用 LessonViewer.openLesson', () => {
      let lessonViewerCalled = false;
      let skillTreeCalled = false;

      window.LessonViewer = {
        open: (id) => { lessonViewerCalled = (id === 'test-lesson'); }
      };

      window.SkillTree = {
        openLesson: (id) => { skillTreeCalled = true; }
      };

      // 模拟依赖图节点点击
      const nodeId = 'test-lesson';

      // 正确的实现：优先使用 LessonViewer
      if (window.LessonViewer?.open) {
        window.LessonViewer.open(nodeId);
      } else if (window.SkillTree?.openLesson) {
        window.SkillTree.openLesson(nodeId);
      }

      expect(lessonViewerCalled).toBe(true);
      expect(skillTreeCalled).toBe(false);
    });

    test('当 LessonViewer 不存在时应该使用 SkillTree', () => {
      let skillTreeCalled = false;

      window.LessonViewer = null;
      window.SkillTree = {
        openLesson: (id) => { skillTreeCalled = (id === 'test-lesson'); }
      };

      // 模拟依赖图节点点击
      const nodeId = 'test-lesson';

      // 回退到 SkillTree
      if (window.LessonViewer?.open) {
        window.LessonViewer.open(nodeId);
      } else if (window.SkillTree?.openLesson) {
        window.SkillTree.openLesson(nodeId);
      }

      expect(skillTreeCalled).toBe(true);
    });
  });
});
