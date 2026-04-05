// 知识树（思维导图）组件

const SkillTree = {
  // 当前过滤条件
  filters: {
    status: null, // 'not-started', 'learning', 'completed', 'mastered'
    difficulty: null, // 'basic', 'intermediate', 'advanced'
    chapterId: null
  },

  // 渲染知识树
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

    // 渲染过滤工具栏
    const filterBarHtml = this.renderFilterBar();

    container.innerHTML = `
      <div class="skill-tree-container">
        ${filterBarHtml}
        ${chapters.map(chapter => this.renderChapter(chapter)).join('')}
      </div>
    `;

    // 绑定展开/收起事件
    container.querySelectorAll('.chapter-header').forEach(header => {
      header.addEventListener('click', () => {
        const card = header.parentElement;
        card.classList.toggle('expanded');
      });
    });

    // 绑定课程点击事件
    container.querySelectorAll('.lesson-item').forEach(item => {
      item.addEventListener('click', () => {
        const lessonId = item.dataset.lessonId;
        if (lessonId) {
          this.openLesson(lessonId);
        }
      });
    });

    // 绑定过滤事件
    this.bindFilterEvents(container);
  },

  // 渲染过滤工具栏
  renderFilterBar() {
    const statusOptions = {
      'not-started': '未开始',
      'learning': '学习中',
      'completed': '已完成',
      'mastered': '已精通'
    };

    return `
      <div class="filter-bar">
        <div class="filter-group">
          <span class="filter-label">状态：</span>
          <button class="filter-btn ${!this.filters.status ? 'active' : ''}" data-filter="all" data-type="status">全部</button>
          ${Object.entries(statusOptions).map(([key, label]) => `
            <button class="filter-btn ${this.filters.status === key ? 'active' : ''}" data-filter="${key}" data-type="status">${label}</button>
          `).join('')}
        </div>
        <button class="filter-reset-btn" id="filter-reset">重置</button>
      </div>
    `;
  },

  // 渲染章节
  renderChapter(chapter) {
    const progress = Content.getChapterProgress(chapter);
    const isExpanded = chapter.order === 1; // 默认展开第一章

    return `
      <div class="chapter-card ${isExpanded ? 'expanded' : ''}" data-chapter-id="${chapter.id}">
        <div class="chapter-header">
          <div class="chapter-info">
            <div class="chapter-title">${chapter.order}. ${chapter.title}</div>
            <div class="chapter-description">${chapter.description}</div>
          </div>
          <div class="chapter-progress">
            <div class="progress-percent">${progress}%</div>
            <div class="chapter-progress-bar">
              <div class="chapter-progress-fill" style="width: ${progress}%"></div>
            </div>
            <span class="expand-icon">▼</span>
          </div>
        </div>
        <div class="lesson-list">
          ${(chapter.lessons || [])
            .filter(lesson => this.shouldShowLesson(lesson))
            .map(lesson => this.renderLesson(lesson))
            .join('')}
        </div>
        ${this.hasActiveFilters() && (chapter.lessons || []).filter(lesson => this.shouldShowLesson(lesson)).length === 0 ? `
          <div class="chapter-no-results">
            <div class="no-results-icon">🔍</div>
            <div>该章节没有符合条件的课程</div>
          </div>
        ` : ''}
      </div>
    `;
  },

  // 检查是否有激活的过滤条件
  hasActiveFilters() {
    return this.filters.status || this.filters.difficulty || this.filters.chapterId;
  },

  // 渲染课程
  renderLesson(lesson) {
    const progress = Storage.getLessonProgress(lesson.id);
    const status = progress?.status || 'not-started';
    const prereqCheck = Content.checkPrerequisites(lesson);

    const statusIcons = {
      'not-started': '○',
      'learning': '◐',
      'completed': '✓',
      'mastered': '★'
    };

    const canAccess = prereqCheck.canAccess || status !== 'not-started';

    return `
      <div class="lesson-item ${status} ${!canAccess ? 'locked' : ''}" data-lesson-id="${lesson.id}">
        <div class="lesson-status ${status}">
          ${statusIcons[status] || '○'}
        </div>
        <div class="lesson-info">
          <div class="lesson-title">${lesson.title}</div>
          <div class="lesson-meta">
            ${lesson.estimatedMinutes || 10}分钟
            ${!prereqCheck.canAccess ? ` · 需先修：${prereqCheck.missing.slice(0, 2).join(', ')}` : ''}
          </div>
        </div>
        <div class="lesson-check">
          ${status === 'completed' || status === 'mastered' ? '✓' : '›'}
        </div>
      </div>
    `;
  },

  // 打开课程
  openLesson(lessonId) {
    const lesson = Content.getLesson(lessonId);
    if (!lesson) return;

    const prereqCheck = Content.checkPrerequisites(lesson);
    const progress = Storage.getLessonProgress(lessonId);

    // 检查先修条件
    if (!prereqCheck.canAccess && (!progress || progress.status === 'not-started')) {
      showToast(`请先完成：${prereqCheck.missing.join(', ')}`);
      return;
    }

    // 打开课程阅读器
    LessonViewer.open(lessonId);
  },

  // 刷新显示
  refresh() {
    const container = document.querySelector('.skill-tree-container');
    if (container) {
      const expandedChapters = container.querySelectorAll('.chapter-card.expanded');
      const expandedIds = Array.from(expandedChapters).map(el => el.dataset.chapterId);

      this.render(container);

      // 恢复展开状态
      expandedIds.forEach(id => {
        const card = container.querySelector(`[data-chapter-id="${id}"]`);
        if (card) card.classList.add('expanded');
      });
    }
  },

  // 绑定过滤事件
  bindFilterEvents(container) {
    const filterBtns = container.querySelectorAll('.filter-btn');
    const resetBtn = document.getElementById('filter-reset');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterType = btn.dataset.type;
        const filterValue = btn.dataset.filter;

        if (filterType === 'status') {
          this.filters.status = filterValue === 'all' ? null : filterValue;
        }

        this.refreshWithFilters();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.filters.status = null;
        this.filters.difficulty = null;
        this.filters.chapterId = null;
        this.refreshWithFilters();
        showToast('过滤条件已重置');
      });
    }
  },

  // 应用过滤条件刷新显示
  refreshWithFilters() {
    const container = document.querySelector('.skill-tree-container');
    if (!container) return;

    // 保存展开状态
    const expandedChapters = container.querySelectorAll('.chapter-card.expanded');
    const expandedIds = Array.from(expandedChapters).map(el => el.dataset.chapterId);

    // 重新渲染
    this.render(container);

    // 恢复展开状态
    expandedIds.forEach(id => {
      const card = container.querySelector(`[data-chapter-id="${id}"]`);
      if (card) card.classList.add('expanded');
    });
  },

  // 检查课程是否符合过滤条件
  shouldShowLesson(lesson) {
    const progress = Storage.getLessonProgress(lesson.id);
    const status = progress?.status || 'not-started';

    // 状态过滤
    if (this.filters.status && status !== this.filters.status) {
      return false;
    }

    // 难度过滤（需要章节数据支持）
    if (this.filters.difficulty) {
      const difficulty = lesson.difficulty || 'intermediate';
      if (difficulty !== this.filters.difficulty) {
        return false;
      }
    }

    return true;
  }
};

window.SkillTree = SkillTree;
