// P0-2 知识树视觉层级优化测试

describe('知识树视觉层级优化', () => {
  beforeEach(() => {
    // 模拟全局对象
    window.Storage = {
      getLessonProgress: (lessonId) => {
        if (lessonId === 'l1') return { status: 'completed' };
        if (lessonId === 'l2') return { status: 'learning' };
        return null;
      }
    };

    window.Content = {
      getChapters: () => [
        { id: 'ch01', order: 1, title: '第一章', lessons: [{ id: 'l1' }, { id: 'l2' }] },
        { id: 'ch02', order: 2, title: '第二章', lessons: [{ id: 'l3' }] },
        { id: 'ch06', order: 6, title: '机器学习', lessons: [{ id: 'l4' }] }
      ]
    };

    document.body.innerHTML = '<div id="skill-tree-container"></div>';
  });

  describe('过滤器功能', () => {
    test('应该初始化过滤器状态', () => {
      expect(SkillTree.filters.domain).toBe('all');
      expect(SkillTree.filters.recommendedMode).toBe(false);
    });

    test('应该渲染过滤器控制栏', () => {
      SkillTree.render(document.getElementById('skill-tree-container'));

      const filtersContainer = document.querySelector('.skill-tree-filters');
      expect(filtersContainer).not.toBeNull();

      // 领域过滤器按钮
      const domainButtons = document.querySelectorAll('[data-filter="domain"]');
      expect(domainButtons.length).toBe(5); // 全部 + 4 个领域

      // 推荐模式开关
      const toggleSwitch = document.querySelector('[data-toggle="recommended"]');
      expect(toggleSwitch).not.toBeNull();
    });

    test('点击领域过滤器应该更新状态', () => {
      SkillTree.render(document.getElementById('skill-tree-container'));

      const aiButton = document.querySelector('[data-filter="domain"][data-value="ai"]');
      aiButton.click();

      expect(SkillTree.filters.domain).toBe('ai');
      expect(aiButton.classList.contains('active')).toBe(true);
    });

    test('点击推荐模式开关应该切换状态', () => {
      SkillTree.render(document.getElementById('skill-tree-container'));

      const toggle = document.querySelector('[data-toggle="recommended"]');
      toggle.click();

      expect(SkillTree.filters.recommendedMode).toBe(true);
      expect(toggle.classList.contains('active')).toBe(true);
    });
  });

  describe('推荐学习路径', () => {
    test('应该识别推荐章节', () => {
      const recommendedIds = SkillTree.getRecommendedChapterIds();

      // 第一章有未完成的课程，应该被推荐
      expect(recommendedIds).toContain('ch01');
    });

    test('推荐章节应该包含 isRecommended 标记', () => {
      const chapters = Content.getChapters();
      const treeData = SkillTree.buildTreeData(chapters);

      // 检查章节节点是否有推荐标记
      const hasRecommended = treeData.children.some(domain =>
        domain.children.some(chapter => chapter.isRecommended === true)
      );

      expect(hasRecommended).toBe(true);
    });

    test('渲染的节点应该包含 recommended 类', () => {
      const chapters = Content.getChapters();
      SkillTree.treeData = SkillTree.buildTreeData(chapters);

      const html = SkillTree.renderTreeNode({
        id: 'ch01',
        title: '第一章',
        type: 'chapter',
        icon: '📚',
        isRecommended: true,
        children: [],
        lessons: []
      });

      expect(html).toContain('recommended');
    });
  });

  describe('领域过滤', () => {
    test('应该正确判断章节所属领域', () => {
      const mathChapter = { id: 'ch01', title: '向量基础' };
      const aiChapter = { id: 'ch06', title: '机器学习入门' };
      const csChapter = { id: 'ch11', title: '图算法' };
      const systemChapter = { id: 'ch16', title: '高性能推理系统' };

      expect(SkillTree.getChapterDomain(mathChapter)).toBe('math');
      expect(SkillTree.getChapterDomain(aiChapter)).toBe('ai');
      expect(SkillTree.getChapterDomain(csChapter)).toBe('cs');
      expect(SkillTree.getChapterDomain(systemChapter)).toBe('system');
    });

    test('领域过滤应该只返回匹配的章节', () => {
      SkillTree.filters.domain = 'math';

      const chapters = Content.getChapters();
      const treeData = SkillTree.buildTreeData(chapters);

      // 只应该有数学领域
      expect(treeData.children.length).toBe(1);
      expect(treeData.children[0].id).toBe('math');
    });

    test('推荐模式过滤应该只返回推荐章节', () => {
      SkillTree.filters.domain = 'all';
      SkillTree.filters.recommendedMode = true;

      const chapters = Content.getChapters();
      const treeData = SkillTree.buildTreeData(chapters);

      // 检查所有章节是否都是推荐的
      const allRecommended = treeData.children.every(domain =>
        domain.children.every(chapter => chapter.isRecommended === true)
      );

      expect(allRecommended).toBe(true);
    });
  });

  describe('节点渲染', () => {
    test('推荐节点应该添加 recommended 类', () => {
      const node = {
        id: 'ch01',
        title: '第一章',
        type: 'chapter',
        icon: '📚',
        isRecommended: true,
        children: [],
        lessons: []
      };

      const html = SkillTree.renderTreeNode(node);

      expect(html).toContain('recommended');
    });

    test('非推荐节点不应该有 recommended 类', () => {
      const node = {
        id: 'ch06',
        title: '机器学习',
        type: 'chapter',
        icon: '📚',
        isRecommended: false,
        children: [],
        lessons: []
      };

      const html = SkillTree.renderTreeNode(node);

      expect(html).not.toContain('recommended');
    });
  });
});
