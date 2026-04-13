// 知识树（思维导图）组件 - 树状结构设计

const SkillTree = {
  // 思维导图数据
  treeData: null,

  // 展开状态
  expandedNodes: {},

  // 过滤器状态
  filters: {
    domain: 'all',  // all, math, ai, cs, system
    recommendedMode: false  // 是否只显示推荐学习路径
  },

  // 重置过滤器为默认值
  resetFilters() {
    this.filters.domain = 'all';
    this.filters.recommendedMode = false;
  },

  // 渲染知识树（思维导图）
  render(container) {
    const chapters = Content.getChapters();

    if (!chapters || chapters.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📚</div>
          <div class="empty-state-title">暂无内容</div>
          <div class="empty-state-description">内容加载中...</div>
        </div>
      `;
      return;
    }

    // 构建树状数据结构
    this.treeData = this.buildTreeData(chapters);

    // 初始化展开状态（根节点默认展开）
    this.expandedNodes['root'] = true;
    chapters.forEach(chapter => {
      this.expandedNodes[chapter.id] = true; // 章节节点默认展开
    });

    container.innerHTML = `
      <div class="skill-tree-container">
        <!-- 过滤器控制栏 -->
        <div class="skill-tree-filters">
          <div class="filter-group">
            <span class="filter-label">领域:</span>
            <button class="filter-btn ${this.filters.domain === 'all' ? 'active' : ''}" data-filter="domain" data-value="all">全部</button>
            <button class="filter-btn domain-math ${this.filters.domain === 'math' ? 'active' : ''}" data-filter="domain" data-value="math">📐 数学</button>
            <button class="filter-btn domain-ai ${this.filters.domain === 'ai' ? 'active' : ''}" data-filter="domain" data-value="ai">🤖 AI</button>
            <button class="filter-btn domain-cs ${this.filters.domain === 'cs' ? 'active' : ''}" data-filter="domain" data-value="cs">💻 CS</button>
            <button class="filter-btn domain-system ${this.filters.domain === 'system' ? 'active' : ''}" data-filter="domain" data-value="system">⚙️ 系统</button>
          </div>
          <div class="filter-actions">
            <button class="reset-filters-btn" onclick="SkillTree.resetFilters(); SkillTree.render(document.querySelector('.skill-tree-container'))">
              🔄 重置
            </button>
          </div>
          <div class="toggle-container">
            <span class="toggle-label">🎯 推荐学习路径</span>
            <div class="toggle-switch ${this.filters.recommendedMode ? 'active' : ''}" data-toggle="recommended">
              <div class="toggle-knob"></div>
            </div>
          </div>
        </div>

        <div class="mindmap-root">
          ${this.renderVerticalCourseList(this.treeData)}
        </div>
      </div>
    `;

    // 绑定节点点击事件
    this.bindNodeEvents(container);
    // 绑定过滤器事件
    this.bindFilterEvents(container);
  },

  // 绑定过滤器事件
  bindFilterEvents(container) {
    // 领域过滤器
    container.querySelectorAll('[data-filter="domain"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.filters.domain = btn.dataset.value;

        // 更新激活状态
        container.querySelectorAll('[data-filter="domain"]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 重新渲染
        this.refresh();
      });
    });

    // 推荐模式开关
    container.querySelectorAll('[data-toggle="recommended"]').forEach(toggle => {
      toggle.addEventListener('click', () => {
        this.filters.recommendedMode = !this.filters.recommendedMode;
        toggle.classList.toggle('active');
        this.refresh();
      });
    });
  },

  // 构建树状数据结构（带过滤）
  buildTreeData(chapters) {
    // 根节点
    const root = {
      id: 'root',
      title: '数学/CS/AI',
      subtitle: '知识体系',
      type: 'root',
      icon: '🌳',
      children: []
    };

    // 按领域分组
    const domains = {
      'math': { id: 'math', title: '数学基础', icon: '📐', color: 'math', children: [] },
      'ai': { id: 'ai', title: '人工智能', icon: '🤖', color: 'ai', children: [] },
      'cs': { id: 'cs', title: '计算机科学', icon: '💻', color: 'cs', children: [] },
      'system': { id: 'system', title: '系统与工程', icon: '⚙️', color: 'system', children: [] }
    };

    // 获取推荐学习的章节 ID 列表
    const recommendedChapterIds = this.getRecommendedChapterIds();

    // 将章节分配到各个领域
    chapters.forEach(chapter => {
      const domain = this.getChapterDomain(chapter);

      // 领域过滤
      if (this.filters.domain !== 'all' && domain !== this.filters.domain) {
        return;
      }

      // 推荐模式过滤
      if (this.filters.recommendedMode && !recommendedChapterIds.includes(chapter.id)) {
        return;
      }

      if (domains[domain]) {
        const chapterNode = {
          id: chapter.id,
          title: chapter.title,
          subtitle: `${chapter.lessons?.length || 0} 节课`,
          type: 'chapter',
          icon: '📚',
          color: this.getChapterColor(chapter),
          lessons: chapter.lessons || [],
          isRecommended: recommendedChapterIds.includes(chapter.id)
        };
        domains[domain].children.push(chapterNode);
      }
    });

    // 添加领域节点到根节点（只添加有子节点的领域）
    Object.values(domains).forEach(domain => {
      if (domain.children.length > 0) {
        root.children.push(domain);
      }
    });

    return root;
  },

  // 获取推荐学习的章节 ID 列表
  getRecommendedChapterIds() {
    const chapters = Content.getChapters();
    const recommended = [];

    // 找到第一个有未完成课程的章节
    for (const chapter of chapters) {
      const lessons = chapter.lessons || [];
      const hasUncompleted = lessons.some(l => {
        const progress = Storage.getLessonProgress(l.id);
        return !progress || progress.status !== 'completed' && progress.status !== 'mastered';
      });

      if (hasUncompleted) {
        recommended.push(chapter.id);
        // 如果是基础章节（order <= 2），也推荐下一个章节
        const currentIndex = chapters.findIndex(c => c.id === chapter.id);
        if (chapter.order <= 2 && chapters[currentIndex + 1]) {
          recommended.push(chapters[currentIndex + 1].id);
        }
        break;
      }
    }

    // 如果所有章节都完成了，推荐复习
    if (recommended.length === 0 && chapters.length > 0) {
      recommended.push(chapters[0].id); // 推荐从第一章开始复习
    }

    return recommended;
  },

  // 判断章节所属领域
  getChapterDomain(chapter) {
    const id = chapter.id || '';
    const title = (chapter.title || '').toLowerCase();
    const description = (chapter.description || '').toLowerCase();

    // 数学基础 (ch01-ch05)
    if (id.match(/ch0[1-5]$/)) {
      return 'math';
    }

    // 人工智能 (ch06-ch10, ch18-ch20)
    if (id.match(/ch0[6-9]$/) || id.match(/ch1[8-9]$/) || id === 'ch20' ||
        title.includes('机器学习') || title.includes('NLP') || title.includes('视觉') ||
        title.includes('音频') || title.includes('多模态') || title.includes('AI') ||
        title.includes('机器人') || title.includes('自主系统') || title.includes('VLA') ||
        title.includes('自动驾驶')) {
      return 'ai';
    }

    // 计算机科学 (ch11-ch15)
    if (id.match(/ch1[1-5]$/) ||
        title.includes('图神经') || title.includes('几何深度') ||
        title.includes('操作系统') || title.includes('计算机架构') ||
        title.includes('并发') || title.includes('数据结构') || title.includes('算法') ||
        title.includes('编程语言') || title.includes('离散数学')) {
      return 'cs';
    }

    // 系统与工程 (ch16-ch17)
    if (id.match(/ch1[6-7]$/) ||
        title.includes('量化') || title.includes('高效架构') || title.includes('推理系统') ||
        title.includes('高性能') || title.includes('部署') || title.includes('边缘')) {
      return 'system';
    }

    return 'math'; // 默认
  },

  // 获取章节颜色
  getChapterColor(chapter) {
    const domain = this.getChapterDomain(chapter);
    const colors = {
      'math': 'math',
      'ai': 'ai',
      'cs': 'cs',
      'system': 'system'
    };
    return colors[domain] || 'math';
  },

  // 渲染树节点
  renderTreeNode(node, level = 0) {
    const isExpanded = this.expandedNodes[node.id] !== false;
    const hasChildren = node.children && node.children.length > 0;
    const isLeaf = node.type === 'lesson';
    const isRecommended = node.isRecommended === true;

    // 节点样式类
    const nodeClass = `mindmap-node node-${node.type} ${isExpanded ? 'expanded' : ''} ${isRecommended ? 'recommended' : ''}`;

    // 渲染节点
    let html = `
      <div class="${nodeClass}" data-node-id="${node.id}" data-node-type="${node.type}" data-level="${level}">
        <div class="node-content">
          ${hasChildren || node.lessons ? `
            <button class="node-toggle ${isExpanded ? 'expanded' : ''}" aria-label="展开/收起">
              <span class="toggle-icon">›</span>
            </button>
          ` : '<span class="node-spacer"></span>'}

          <div class="node-body ${node.color ? 'color-' + node.color : ''}">
            <span class="node-icon">${node.icon || ''}</span>
            <div class="node-info">
              <div class="node-title">${node.title}</div>
              ${node.subtitle ? `<div class="node-subtitle">${node.subtitle}</div>` : ''}
            </div>
            ${this.getNodeProgress(node)}
          </div>
        </div>

        ${hasChildren && isExpanded ? `
          <div class="node-children active">
            ${node.children.map(child => this.renderTreeNode(child, level + 1)).join('')}
          </div>
        ` : ''}

        ${node.lessons && isExpanded && node.type === 'chapter' ? `
          <div class="node-lessons active">
            ${node.lessons.map(lesson => this.renderLessonNode(lesson)).join('')}
          </div>
        ` : ''}
      </div>
    `;

    return html;
  },

  // 渲染课程节点（叶子节点）
  renderLessonNode(lesson) {
    const progress = Storage.getLessonProgress(lesson.id);
    const status = progress?.status || 'not-started';

    const statusIcons = {
      'not-started': '○',
      'learning': '◐',
      'completed': '✓',
      'mastered': '★'
    };

    return `
      <div class="mindmap-node node-lesson ${status}" data-lesson-id="${lesson.id}">
        <div class="node-content">
          <span class="node-spacer"></span>
          <div class="node-body">
            <span class="node-icon">${statusIcons[status]}</span>
            <div class="node-info">
              <div class="node-title">${lesson.title}</div>
              <div class="node-subtitle">${lesson.estimatedMinutes || 10}分钟</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 获取节点进度指示器
  getNodeProgress(node) {
    if (node.type === 'lesson') {
      const progress = Storage.getLessonProgress(node.id);
      const status = progress?.status || 'not-started';
      const icons = {
        'not-started': '',
        'learning': '<span class="progress-badge learning">学习中</span>',
        'completed': '<span class="progress-badge completed">已完成</span>',
        'mastered': '<span class="progress-badge mastered">已精通</span>'
      };
      return icons[status] || '';
    }

    if (node.type === 'chapter' && node.lessons) {
      const completed = node.lessons.filter(l => {
        const p = Storage.getLessonProgress(l.id);
        return p && (p.status === 'completed' || p.status === 'mastered');
      }).length;
      const percent = Math.round((completed / node.lessons.length) * 100);

      return `
        <div class="node-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percent}%"></div>
          </div>
          <span class="progress-text">${percent}%</span>
        </div>
      `;
    }

    return '';
  },

  // 绑定节点事件
  bindNodeEvents(container) {
    // 展开/收起节点
    container.querySelectorAll('.node-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const nodeEl = toggle.closest('.mindmap-node');
        const nodeId = nodeEl.dataset.nodeId;

        this.expandedNodes[nodeId] = !this.expandedNodes[nodeId];
        nodeEl.classList.toggle('expanded');
        toggle.classList.toggle('expanded');

        // 重新渲染该节点的子节点
        this.refreshNode(nodeId);
      });
    });

    // 点击课程节点打开课程
    container.querySelectorAll('.node-lesson').forEach(lessonNode => {
      lessonNode.addEventListener('click', (e) => {
        e.stopPropagation();
        const lessonId = lessonNode.dataset.lessonId;
        if (lessonId) {
          this.openLesson(lessonId);
        }
      });
    });

    // 点击章节节点（可以展开/收起）
    container.querySelectorAll('.node-chapter > .node-content').forEach(chapterContent => {
      chapterContent.addEventListener('click', (e) => {
        if (!e.target.closest('.node-toggle')) {
          const nodeEl = chapterContent.closest('.mindmap-node');
          const nodeId = nodeEl.dataset.nodeId;

          this.expandedNodes[nodeId] = !this.expandedNodes[nodeId];
          nodeEl.classList.toggle('expanded');
          nodeEl.querySelector('.node-toggle')?.classList.toggle('expanded');
        }
      });
    });
  },

  // 刷新单个节点
  refreshNode(nodeId) {
    const nodeEl = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (!nodeEl) return;

    const isExpanded = nodeEl.classList.contains('expanded');
    const nodeType = nodeEl.dataset.nodeType;

    // 查找对应的数据节点
    let nodeData;
    if (nodeId === 'root') {
      nodeData = this.treeData;
    } else {
      nodeData = this.findNode(this.treeData, nodeId);
    }

    if (!nodeData) return;

    // 更新子节点区域
    const childrenContainer = nodeEl.querySelector('.node-children');
    const lessonsContainer = nodeEl.querySelector('.node-lessons');

    if (isExpanded && nodeData.children) {
      if (childrenContainer) {
        childrenContainer.innerHTML = nodeData.children.map(child =>
          this.renderTreeNode(child, parseInt(nodeEl.dataset.level || '0') + 1)
        ).join('');
        this.bindNodeEvents(nodeEl);
      }
    }

    if (isExpanded && nodeData.lessons && nodeType === 'chapter') {
      if (lessonsContainer) {
        lessonsContainer.innerHTML = nodeData.lessons.map(lesson =>
          this.renderLessonNode(lesson)
        ).join('');
        this.bindNodeEvents(nodeEl);
      }
    }
  },

  // 查找节点数据
  findNode(root, nodeId) {
    if (root.id === nodeId) return root;

    if (root.children) {
      for (const child of root.children) {
        const found = this.findNode(child, nodeId);
        if (found) return found;
      }
    }

    return null;
  },

  // 打开课程
  openLesson(lessonId) {
    const lesson = Content.getLesson(lessonId);
    if (!lesson) return;

    LessonViewer.open(lessonId);
  },

  // 渲染竖向课程列表（课程表布局）
  renderVerticalCourseList(root) {
    if (!root.children || root.children.length === 0) {
      return '<div class="empty-state"><p>没有匹配的课程</p></div>';
    }

    // 按领域渲染课程卡片
    return root.children.map(domain => `
      <div class="domain-card domain-${domain.id}">
        <div class="domain-header">
          <span class="domain-icon">${domain.icon}</span>
          <span class="domain-title">${domain.title}</span>
          <span class="domain-count">${domain.children.length} 个章节</span>
        </div>
        <div class="domain-content">
          ${domain.children.map(chapter => `
            <div class="chapter-card ${this.expandedNodes[chapter.id] !== false ? 'expanded' : ''}" data-node-id="${chapter.id}" data-node-type="chapter">
              <div class="chapter-header" onclick="SkillTree.toggleChapter('${chapter.id}')">
                <div class="chapter-left">
                  <span class="chapter-icon">${chapter.icon}</span>
                  <div class="chapter-info">
                    <div class="chapter-title">${chapter.title}</div>
                    <div class="chapter-meta">${chapter.lessons?.length || 0} 节课 · ${chapter.isRecommended ? '<span class="recommended-badge">推荐</span>' : ''}</div>
                  </div>
                </div>
                <div class="chapter-right">
                  ${this.getChapterProgressHtml(chapter)}
                  <span class="expand-icon">${this.expandedNodes[chapter.id] !== false ? '›' : '‹'}</span>
                </div>
              </div>
              ${this.expandedNodes[chapter.id] !== false ? `
              <div class="chapter-lessons">
                ${chapter.lessons.map((lesson, idx) => `
                  <div class="lesson-item ${this.getLessonStatus(lesson.id)}" onclick="SkillTree.openLesson('${lesson.id}')" style="animation-delay: ${idx * 0.05}s">
                    <span class="lesson-status">${this.getLessonStatusIcon(lesson.id)}</span>
                    <span class="lesson-title">${lesson.title}</span>
                    <span class="lesson-time">${lesson.estimatedMinutes || 10}分钟</span>
                  </div>
                `).join('')}
              </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  },

  // 切换章节展开/收起
  toggleChapter(chapterId) {
    this.expandedNodes[chapterId] = !(this.expandedNodes[chapterId] !== false);
    this.refresh();
  },

  // 获取章节进度 HTML
  getChapterProgressHtml(chapter) {
    const lessons = chapter.lessons || [];
    if (lessons.length === 0) return '';

    const completed = lessons.filter(l => {
      const p = Storage.getLessonProgress(l.id);
      return p && (p.status === 'completed' || p.status === 'mastered');
    }).length;
    const percent = Math.round((completed / lessons.length) * 100);

    return `
      <div class="chapter-progress-mini">
        <div class="progress-bar-mini">
          <div class="progress-fill-mini" style="width: ${percent}%"></div>
        </div>
        <span class="progress-percent">${percent}%</span>
      </div>
    `;
  },

  // 获取课程状态类名
  getLessonStatus(lessonId) {
    const progress = Storage.getLessonProgress(lessonId);
    return progress?.status || 'not-started';
  },

  // 获取课程状态图标
  getLessonStatusIcon(lessonId) {
    const progress = Storage.getLessonProgress(lessonId);
    const status = progress?.status || 'not-started';
    const icons = {
      'not-started': '○',
      'learning': '◐',
      'completed': '✓',
      'mastered': '★'
    };
    return icons[status] || '○';
  },

  // 刷新
  refresh() {
    const container = document.querySelector('.skill-tree-container');
    if (container) {
      this.render(container);
    }
  }
};

window.SkillTree = SkillTree;
