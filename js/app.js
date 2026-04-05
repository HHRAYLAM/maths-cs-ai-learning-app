// 主应用逻辑

const App = {
  // 当前页面
  currentPage: 'skill-tree',

  // 初始化
  async init() {
    console.log('应用初始化...');

    // 初始化练习题数据
    QuizData.init();

    // 加载语言设置
    const currentLang = Storage.getLanguage();
    console.log('当前语言:', currentLang);

    // 加载内容（根据语言选择）
    const contentPack = currentLang === 'en-US' ? 'en' : 'math-cs-ai';
    await Content.load(contentPack);

    // 应用主题
    const currentTheme = Storage.getTheme();
    Storage.applyTheme(currentTheme);

    // 绑定导航事件
    this.bindNavigation();

    // 绑定弹窗事件
    this.bindModals();

    // 监听进度更新
    window.addEventListener('progress-updated', () => {
      this.refreshCurrentPage();
    });

    // 监听进度重置
    window.addEventListener('progress-reset', () => {
      this.refreshCurrentPage();
      showToast('进度已重置');
    });

    // 监听主题切换
    window.addEventListener('theme-changed', (e) => {
      Storage.applyTheme(e.detail.theme);
    });

    // 监听书签变化
    window.addEventListener('bookmarks-changed', () => {
      this.refreshCurrentPage();
    });

    // 监听错题变化
    window.addEventListener('wrong-answers-changed', () => {
      this.refreshCurrentPage();
    });

    // 监听成就解锁
    window.addEventListener('achievement-unlocked', (e) => {
      this.showAchievementToast(e.detail.achievement);
    });

    // 渲染默认页面
    this.navigateTo('skill-tree');

    console.log('应用初始化完成');
  },

  // 绑定底部导航
  bindNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        if (page) {
          this.navigateTo(page);
        }
      });
    });

    // 处理 hash 变化
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      if (hash && ['dashboard', 'skill-tree', 'dependency', 'progress'].includes(hash)) {
        this.navigateTo(hash);
      }
    });
  },

  // 绑定弹窗
  bindModals() {
    // 语言切换按钮
    document.getElementById('language-btn')?.addEventListener('click', () => {
      document.getElementById('settings-modal')?.classList.remove('hidden');
    });

    // 语言选择器
    this.bindLanguageSelector();

    // 主题选择器
    this.bindThemeSelector();

    // 内容包按钮
    document.getElementById('content-pack-btn')?.addEventListener('click', () => {
      this.showContentPackModal();
    });

    // 设置按钮
    document.getElementById('settings-btn')?.addEventListener('click', () => {
      document.getElementById('settings-modal')?.classList.remove('hidden');
    });

    // 重置进度按钮
    document.getElementById('reset-progress')?.addEventListener('click', () => {
      if (confirm('确定要重置所有学习进度吗？此操作不可恢复！')) {
        Storage.resetAllProgress();
        document.getElementById('settings-modal')?.classList.add('hidden');
      }
    });

    // 搜索按钮
    document.getElementById('search-btn')?.addEventListener('click', () => {
      this.showSearchModal();
    });
  },

  // 导航到指定页面
  navigateTo(page) {
    this.currentPage = page;

    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // 更新标题
    const titles = {
      'dashboard': '学习概览',
      'skill-tree': '知识框架',
      'dependency': '依赖关系',
      'progress': '学习进度'
    };
    document.getElementById('page-title').textContent = titles[page] || '知识框架';

    // 渲染页面内容
    const app = document.getElementById('app');
    app.innerHTML = '';

    switch (page) {
      case 'dashboard':
        this.renderDashboard(app);
        break;
      case 'skill-tree':
        SkillTree.render(app);
        break;
      case 'dependency':
        DependencyGraph.render(app);
        break;
      case 'progress':
        this.renderProgress(app);
        break;
    }

    // 更新 hash
    window.location.hash = page;
  },

  // 刷新当前页面
  refreshCurrentPage() {
    const app = document.getElementById('app');
    if (!app) return;

    switch (this.currentPage) {
      case 'dashboard':
        this.renderDashboard(app);
        break;
      case 'skill-tree':
        SkillTree.refresh();
        break;
      case 'dependency':
        DependencyGraph.render(app);
        break;
      case 'progress':
        this.renderProgress(app);
        break;
    }
  },

  // 渲染概览页面
  renderDashboard(container) {
    const summary = ProgressManager.getSummary();
    const stats = Storage.getStats();
    const dueReviews = Storage.getLessonsDueForReview();
    const currentLesson = Storage.getCurrentLesson();
    const currentLessonData = currentLesson ? Content.getLesson(currentLesson) : null;

    container.innerHTML = `
      <div class="dashboard-container">
        <!-- 继续学习 -->
        <div class="dashboard-section">
          <h2 class="dashboard-section-title">
            ${currentLesson ? '继续学习' : '开始学习'}
          </h2>
          <div class="card continue-learning-card">
            ${currentLesson ? `
              <div class="current-lesson-info">
                <div class="current-lesson-badge">当前课程</div>
                <div class="current-lesson-title">${currentLessonData?.title || '未知课程'}</div>
                <div class="current-lesson-chapter">📚 ${Content.getChapter(currentLessonData?.chapterId)?.title || ''}</div>
              </div>
              <button class="btn btn-primary" onclick="App.continueLearning()">
                继续学习 →
              </button>
            ` : `
              <div class="empty-lesson">
                <div class="empty-lesson-icon">🎓</div>
                <div class="empty-lesson-text">还没有开始学习</div>
              </div>
              <button class="btn btn-primary" onclick="App.startFirstLesson()">
                开始第一章
              </button>
            `}
          </div>
        </div>

        <!-- 统计卡片 -->
        <div class="dashboard-section">
          <h2 class="dashboard-section-title">学习统计</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${stats.completionRate}%</div>
              <div class="stat-label">完成率</div>
            </div>
            <div class="stat-card green">
              <div class="stat-value">${stats.completed + stats.mastered}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="stat-card orange">
              <div class="stat-value">${stats.mastered}</div>
              <div class="stat-label">已精通</div>
            </div>
            <div class="stat-card purple">
              <div class="stat-value">${dueReviews.length}</div>
              <div class="stat-label">待复习</div>
            </div>
          </div>
        </div>

        <!-- 总学习时长 -->
        <div class="dashboard-section">
          <h2 class="dashboard-section-title">学习时长</h2>
          <div class="card">
            <div style="text-align: center;">
              <div style="font-size: 36px; font-weight: 700; color: var(--primary-color);">
                ${ProgressManager.formatTime(stats.totalTimeSeconds)}
              </div>
              <div style="color: var(--gray-500); margin-top: 8px;">累计学习时长</div>
            </div>
          </div>
        </div>

        <!-- 待复习课程 -->
        ${dueReviews.length > 0 ? `
          <div class="dashboard-section">
            <h2 class="dashboard-section-title">待复习课程</h2>
            <div class="recent-lessons">
              ${dueReviews.slice(0, 5).map(item => {
                const lesson = Content.getLesson(item.lessonId);
                return `
                  <div class="recent-lesson-item" style="cursor: pointer;" onclick="App.reviewLesson('${item.lessonId}')">
                    <div class="recent-lesson-icon">📚</div>
                    <div class="recent-lesson-info">
                      <div class="recent-lesson-title">${lesson?.title || item.lessonId}</div>
                      <div class="recent-lesson-time">已逾期 ${item.daysOverdue} 天</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 学习统计 -->
        <div class="dashboard-section">
          <h2 class="dashboard-section-title">学习统计</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${stats.completionRate}%</div>
              <div class="stat-label">完成率</div>
            </div>
            <div class="stat-card green">
              <div class="stat-value">${stats.completed + stats.mastered}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="stat-card orange">
              <div class="stat-value">${stats.mastered}</div>
              <div class="stat-label">已精通</div>
            </div>
            <div class="stat-card purple">
              <div class="stat-value">${dueReviews.length}</div>
              <div class="stat-label">待复习</div>
            </div>
          </div>
        </div>

        <!-- 连续学习 -->
        <div class="dashboard-section">
          <h2 class="dashboard-section-title">连续学习</h2>
          <div class="card">
            <div style="text-align: center;">
              <div style="font-size: 48px; font-weight: 700; color: var(--danger-color);">
                🔥 ${Storage.getLearningStreak()} 天
              </div>
              <div style="color: var(--gray-500); margin-top: 8px;">连续学习天数</div>
            </div>
          </div>
        </div>

        <!-- 成就 -->
        <div class="dashboard-section">
          <h2 class="dashboard-section-title">成就徽章</h2>
          <div class="card">
            ${this.renderAchievementsSection()}
          </div>
        </div>

        <!-- 错题本 -->
        <div class="dashboard-section">
          <h2 class="dashboard-section-title">错题本</h2>
          <div class="card">
            ${this.renderWrongAnswersSection()}
          </div>
        </div>

        <!-- 我的收藏 -->
        <div class="dashboard-section">
          <h2 class="dashboard-section-title">我的收藏</h2>
          <div class="card">
            ${this.renderBookmarksSection()}
          </div>
        </div>
      </div>
    `;

    // 绑定书签项点击事件
    container.querySelectorAll('.bookmark-item').forEach(item => {
      item.addEventListener('click', () => {
        const lessonId = item.dataset.lessonId;
        if (lessonId) {
          LessonViewer.open(lessonId);
        }
      });
    });

    // 检查成就
    this.checkAchievements();
  },

  // 渲染成就区域
  renderAchievementsSection() {
    const achievements = Storage.getAchievements();
    const definitions = Storage.getAchievementDefinitions();
    const unlockedIds = achievements.map(a => a.id);

    if (achievements.length === 0) {
      return `
        <div class="achievements-empty">
          <div class="achievements-empty-icon">🏆</div>
          <div class="achievements-empty-title">还没有解锁成就</div>
          <div class="achievements-empty-description">完成课程、连续学习来解锁成就</div>
        </div>
      `;
    }

    // 显示已解锁的成就
    return `
      <div class="achievements-list">
        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
          ${achievements.map(a => `
            <div class="achievement-badge" title="${a.name}: ${a.description}">
              <span class="achievement-icon">${a.icon}</span>
              <span class="achievement-name">${a.name}</span>
            </div>
          `).join('')}
        </div>
        <div style="margin-top: 12px; font-size: 13px; color: var(--gray-500);">
          已解锁 ${achievements.length} / ${definitions.length} 个成就
        </div>
      </div>
    `;
  },

  // 渲染错题本区域
  renderWrongAnswersSection() {
    const stats = Storage.getWrongAnswerStats();
    const activeWrongAnswers = Storage.getActiveWrongAnswers();

    if (stats.total === 0) {
      return `
        <div class="wrong-answers-empty">
          <div class="wrong-answers-empty-icon">✅</div>
          <div class="wrong-answers-empty-title">太棒了！</div>
          <div class="wrong-answers-empty-description">还没有错题，继续保持！</div>
        </div>
      `;
    }

    return `
      <div class="wrong-answers-stats">
        <div style="display: flex; justify-content: space-around; text-align: center; margin-bottom: 16px;">
          <div>
            <div style="font-size: 24px; font-weight: 700; color: var(--danger-color);">${stats.active}</div>
            <div style="font-size: 12px; color: var(--gray-500);">待掌握</div>
          </div>
          <div>
            <div style="font-size: 24px; font-weight: 700; color: var(--success-color);">${stats.mastered}</div>
            <div style="font-size: 12px; color: var(--gray-500);">已掌握</div>
          </div>
          <div>
            <div style="font-size: 24px; font-weight: 700; color: var(--primary-color);">${stats.masteryRate}%</div>
            <div style="font-size: 12px; color: var(--gray-500);">掌握率</div>
          </div>
        </div>
        ${activeWrongAnswers.length > 0 ? `
          <div style="font-size: 13px; color: var(--gray-500);">
            最近错题：${activeWrongAnswers.slice(0, 3).map(wa => {
              const lesson = Content.getLesson(wa.lessonId);
              return lesson?.title || wa.lessonId;
            }).join(', ')}...
          </div>
        ` : ''}
      </div>
    `;
  },

  // 检查成就
  checkAchievements() {
    const achievementIds = [
      'first_lesson', 'five_lessons', 'ten_lessons', 'twenty_lessons',
      'streak_3days', 'streak_7days', 'streak_30days',
      'master_5', 'review_10'
    ];

    achievementIds.forEach(id => {
      Storage.checkAndUnlockAchievement(id);
    });
  },

  // 渲染书签区域
  renderBookmarksSection() {
    const bookmarks = Storage.getBookmarkedLessons();

    if (bookmarks.length === 0) {
      return `
        <div class="bookmarks-empty">
          <div class="bookmarks-empty-icon">⭐</div>
          <div class="bookmarks-empty-title">还没有收藏任何课程</div>
          <div class="bookmarks-empty-description">在课程页面点击星标按钮添加收藏</div>
        </div>
      `;
    }

    return `
      <div class="bookmarks-list">
        ${bookmarks.map(lesson => `
          <div class="bookmark-item" data-lesson-id="${lesson.id}" style="cursor: pointer;">
            <div class="bookmark-star">⭐</div>
            <div class="bookmark-info">
              <div class="bookmark-title">${lesson.title}</div>
              <div class="bookmark-chapter">📚 ${Content.getChapter(lesson.chapterId)?.title || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // 渲染进度页面
  renderProgress(container) {
    const stats = Storage.getStats();
    const chapters = Content.getChapters();

    container.innerHTML = `
      <div class="dashboard-container">
        <!-- 总体进度 -->
        <div class="dashboard-section">
          <h2 class="dashboard-section-title">总体进度</h2>
          <div class="card">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <div style="flex: 1;">
                <div class="progress-bar" style="height: 12px;">
                  <div class="progress-bar-fill" style="width: ${stats.completionRate}%"></div>
                </div>
              </div>
              <div style="font-size: 24px; font-weight: 700; color: var(--primary-color);">
                ${stats.completionRate}%
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; color: var(--gray-500); font-size: 14px;">
              <span>已完成：${stats.completed + stats.mastered}</span>
              <span>总计：${stats.totalLessons}</span>
            </div>
          </div>
        </div>

        <!-- 章节进度 -->
        <div class="dashboard-section">
          <h2 class="dashboard-section-title">章节进度</h2>
          ${chapters.map(chapter => {
            const progress = Content.getChapterProgress(chapter);
            return `
              <div class="card" style="padding: 12px 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="font-weight: 600;">${chapter.order}. ${chapter.title}</span>
                  <span style="color: var(--primary-color); font-weight: 600;">${progress}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-bar-fill" style="width: ${progress}%"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- 掌握度分布 -->
        <div class="dashboard-section">
          <h2 class="dashboard-section-title">掌握度分布</h2>
          <div class="stats-grid">
            <div class="stat-card" style="background: var(--gray-200);">
              <div class="stat-value" style="color: var(--gray-600);">${stats.notStarted}</div>
              <div class="stat-label">未开始</div>
            </div>
            <div class="stat-card" style="background: var(--primary-color);">
              <div class="stat-value">${stats.learning}</div>
              <div class="stat-label">学习中</div>
            </div>
            <div class="stat-card green">
              <div class="stat-value">${stats.completed}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="stat-card orange">
              <div class="stat-value">${stats.mastered}</div>
              <div class="stat-label">已精通</div>
            </div>
          </div>
        </div>

        <!-- 学习时长 -->
        <div class="dashboard-section">
          <h2 class="dashboard-section-title">学习时长</h2>
          <div class="card">
            <div style="text-align: center;">
              <div style="font-size: 32px; font-weight: 700; color: var(--primary-color);">
                ${ProgressManager.formatTime(stats.totalTimeSeconds)}
              </div>
              <div style="color: var(--gray-500); margin-top: 8px;">累计学习时长</div>
            </div>
          </div>
        </div>

        <!-- 复习次数 -->
        <div class="dashboard-section">
          <h2 class="dashboard-section-title">复习统计</h2>
          <div class="card">
            <div style="text-align: center;">
              <div style="font-size: 32px; font-weight: 700; color: var(--primary-color);">
                ${stats.totalReviews}
              </div>
              <div style="color: var(--gray-500); margin-top: 8px;">累计复习次数</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 显示内容包选择弹窗
  showContentPackModal() {
    const modal = document.getElementById('content-pack-modal');
    const list = document.getElementById('content-pack-list');

    const packs = Content.getPacks();
    list.innerHTML = packs.map(pack => `
      <div class="pack-item ${Content.activePack === pack.id ? 'active' : ''}" onclick="App.switchContentPack('${pack.id}')">
        <div style="font-weight: 600; font-size: 16px;">${pack.name}</div>
        <div style="color: var(--gray-500); font-size: 13px;">${pack.description}</div>
        <div style="color: var(--gray-400); font-size: 12px; margin-top: 4px;">${pack.chapters} 章节</div>
      </div>
    `).join('');

    modal?.classList.remove('hidden');
  },

  // 绑定语言选择器
  bindLanguageSelector() {
    const buttons = document.querySelectorAll('.language-btn');
    const currentLang = Storage.getLanguage();

    // 更新 HTML lang 属性
    document.documentElement.lang = currentLang;

    buttons.forEach(btn => {
      if (btn.dataset.lang === currentLang) {
        btn.classList.add('active');
      }
      btn.addEventListener('click', async () => {
        const newLang = btn.dataset.lang;
        Storage.setLanguage(newLang);

        // 更新 HTML lang 属性
        document.documentElement.lang = newLang;

        // 更新激活状态
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 根据语言重新加载内容
        const contentPack = newLang === 'en-US' ? 'en' : 'math-cs-ai';
        await Content.load(contentPack);

        // 刷新当前页面
        this.refreshCurrentPage();
        // 刷新课程内容
        if (LessonViewer.currentLesson) {
          LessonViewer.refresh();
        }

        showToast(`语言已切换为：${newLang === 'zh-CN' ? '中文' : 'English'}`);
      });
    });
  },

  // 绑定主题选择器
  bindThemeSelector() {
    const buttons = document.querySelectorAll('.theme-btn');
    const currentTheme = Storage.getTheme();

    buttons.forEach(btn => {
      if (btn.dataset.theme === currentTheme) {
        btn.classList.add('active');
      }
      btn.addEventListener('click', () => {
        const newTheme = btn.dataset.theme;
        Storage.setTheme(newTheme);
        Storage.applyTheme(newTheme);

        // 更新激活状态
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const themeNames = { 'light': '浅色', 'dark': '暗色', 'auto': '跟随系统' };
        showToast(`主题已切换为：${themeNames[newTheme] || '自动'}`);
      });
    });

    // 监听系统主题变化（当设置为自动时）
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (currentTheme === 'auto') {
        Storage.applyTheme('auto');
      }
    });
  },

  // 切换内容包
  async switchContentPack(packId) {
    await Content.load(packId);
    document.getElementById('content-pack-modal')?.classList.add('hidden');
    this.refreshCurrentPage();
    showToast(`已切换到 ${packId}`);
  },

  // 显示搜索弹窗
  showSearchModal() {
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    const hints = document.getElementById('search-hints');

    modal?.classList.remove('hidden');
    input?.focus();

    // 清空搜索结果
    if (results) results.innerHTML = '';
    if (hints) hints.style.display = 'block';

    // 绑定输入事件
    input?.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length > 0) {
        this.performSearch(query);
        if (hints) hints.style.display = 'none';
      } else {
        if (results) results.innerHTML = '';
        if (hints) hints.style.display = 'block';
      }
    });

    // 绑定关闭按钮
    document.getElementById('search-close')?.addEventListener('click', () => {
      modal?.classList.add('hidden');
    });
  },

  // 执行搜索
  performSearch(query) {
    const results = document.getElementById('search-results');
    if (!results) return;

    const chapters = Content.getChapters();
    const matches = [];

    // 搜索所有课程
    for (const chapter of chapters) {
      for (const lesson of (chapter.lessons || [])) {
        const titleMatch = lesson.title.toLowerCase().includes(query.toLowerCase());
        const descMatch = (lesson.description || '').toLowerCase().includes(query.toLowerCase());

        if (titleMatch || descMatch) {
          matches.push({
            ...lesson,
            chapterTitle: chapter.title,
            chapterId: chapter.id,
            matchType: titleMatch ? 'title' : 'description'
          });
        }
      }
    }

    // 按相关性排序（标题匹配优先）
    matches.sort((a, b) => {
      if (a.matchType === 'title' && b.matchType === 'description') return -1;
      if (a.matchType === 'description' && b.matchType === 'title') return 1;
      return 0;
    });

    // 显示结果
    if (matches.length === 0) {
      results.innerHTML = `
        <div class="search-empty">
          <div class="search-empty-icon">🔍</div>
          <div class="search-empty-title">未找到匹配结果</div>
          <div class="search-empty-description">尝试其他关键词试试</div>
        </div>
      `;
    } else {
      results.innerHTML = matches.map(lesson => `
        <div class="search-result-item" data-lesson-id="${lesson.id}">
          <div class="search-result-title">${lesson.title}</div>
          <div class="search-result-chapter">📚 ${lesson.chapterTitle}</div>
        </div>
      `).join('');

      // 绑定点击事件
      results.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const lessonId = item.dataset.lessonId;
          if (lessonId) {
            document.getElementById('search-modal')?.classList.add('hidden');
            SkillTree.openLesson(lessonId);
          }
        });
      });
    }
  },

  // 继续学习
  continueLearning() {
    const currentLesson = Storage.getCurrentLesson();
    if (currentLesson) {
      LessonViewer.open(currentLesson);
    } else {
      // 从第一章第一节课开始
      this.startFirstLesson();
    }
  },

  // 开始第一课
  startFirstLesson() {
    const chapters = Content.getChapters();
    const firstLesson = chapters[0]?.lessons?.[0];
    if (firstLesson) {
      LessonViewer.open(firstLesson.id);
    } else {
      showToast('暂无可学习内容');
    }
  },

  // 复习课程
  reviewLesson(lessonId) {
    Storage.reviewLesson(lessonId);
    showToast('已完成复习');
    this.refreshCurrentPage();
  }
};

// 全局辅助函数
function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2000);
  }
}

function closeModal(modalId) {
  document.getElementById(modalId)?.classList.add('hidden');
}

// 显示成就解锁提示
function closeModal(modalId) {
  document.getElementById(modalId)?.classList.add('hidden');
}

// 显示成就解锁提示
function showAchievementToast(achievement) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 24px;">${achievement.icon}</span>
        <div>
          <div style="font-weight: 600;">成就解锁！</div>
          <div style="font-size: 12px;">${achievement.name} - ${achievement.description}</div>
        </div>
      </div>
    `;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 4000);
  }
}

// 导出到全局
window.showAchievementToast = showAchievementToast;

// 打开练习弹窗
function openQuiz(lessonId) {
  const quiz = QuizData.getQuiz(lessonId);
  const modal = document.getElementById('quiz-modal');
  const container = document.getElementById('quiz-container');
  const title = document.getElementById('quiz-title');

  if (!quiz) {
    container.innerHTML = `
      <div class="no-quiz-hint">
        <div class="no-quiz-hint-icon">📝</div>
        <div>暂无练习题</div>
        <div style="color: var(--gray-500); font-size: 14px; margin-top: 8px;">
          学完其他课程后再来看看
        </div>
      </div>
    `;
    title.textContent = '练习题';
  } else {
    title.textContent = `${quiz.lessonTitle} - 练习题`;
    LessonViewer.currentQuizIndex = 0;
    renderQuizQuestion(lessonId, 0);
  }

  modal?.classList.remove('hidden');
}

// 渲染练习题目
function renderQuizQuestion(lessonId, index) {
  const quiz = QuizData.getQuiz(lessonId);
  const container = document.getElementById('quiz-container');

  if (!quiz || index >= quiz.questions.length) {
    // 所有题目已完成
    container.innerHTML = `
      <div class="empty-state" style="padding: 32px;">
        <div class="empty-state-icon">🎉</div>
        <div class="empty-state-title">太棒了！</div>
        <div class="empty-state-description">已完成所有练习题</div>
      </div>
    `;
    return;
  }

  const question = quiz.questions[index];
  const progress = document.getElementById('quiz-progress');

  let html = `
    <div class="quiz-progress">
      <span class="quiz-progress-text">第 ${index + 1} / ${quiz.questions.length} 题</span>
    </div>
    <div class="quiz-question" data-question-index="${index}">
      <div class="quiz-question-title">${index + 1}. ${question.question}</div>
  `;

  if (question.type === 'choice') {
    html += `
      <div class="quiz-options">
        ${question.options.map((opt, i) => `
          <div class="quiz-option" data-option="${i}">
            <input type="radio" name="quiz-answer" class="quiz-option-input" value="${i}">
            <span>${opt}</span>
          </div>
        `).join('')}
      </div>
      <button class="quiz-check-btn" onclick="checkChoiceAnswer('${lessonId}', ${index})">提交答案</button>
    `;
  } else if (question.type === 'fill') {
    html += `
      <div class="quiz-answer-area">
        <input type="text" class="quiz-input" id="fill-answer-${index}" placeholder="输入你的答案">
        <button class="quiz-check-btn" onclick="checkFillAnswer('${lessonId}', ${index})">提交答案</button>
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;

  // 绑定选项点击事件
  container.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      if (e.target.classList.contains('quiz-option-input')) return;
      const input = opt.querySelector('.quiz-option-input');
      input.checked = true;
      container.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
}

// 检查选择题答案
function checkChoiceAnswer(lessonId, questionIndex) {
  const selected = document.querySelector(`.quiz-question[data-question-index="${questionIndex}"] input[name="quiz-answer"]:checked`);

  if (!selected) {
    showToast('请先选择一个答案');
    return;
  }

  const userAnswer = parseInt(selected.value);
  const result = QuizData.checkAnswer(lessonId, questionIndex, userAnswer);

  showAnswerResult(questionIndex, result, userAnswer);
}

// 检查填空题答案
function checkFillAnswer(lessonId, questionIndex) {
  const input = document.getElementById(`fill-answer-${questionIndex}`);
  const userAnswer = input.value.trim();

  if (!userAnswer) {
    showToast('请输入答案');
    return;
  }

  const result = QuizData.checkAnswer(lessonId, questionIndex, userAnswer);
  showAnswerResult(questionIndex, result, userAnswer);
}

// 显示答案结果
function showAnswerResult(questionIndex, result, userAnswer) {
  const container = document.getElementById('quiz-container');
  const currentQuestion = container.querySelector(`[data-question-index="${questionIndex}"]`);

  // 禁用提交按钮
  currentQuestion.querySelector('.quiz-check-btn').disabled = true;

  // 标记选项
  if (result.correct) {
    currentQuestion.querySelector('.quiz-option-input:checked')?.closest('.quiz-option')?.classList.add('correct');
  } else {
    currentQuestion.querySelector('.quiz-option-input:checked')?.closest('.quiz-option')?.classList.add('incorrect');
  }

  // 添加解释
  const explanationHtml = `
    <div class="quiz-explanation ${result.correct ? 'correct' : 'incorrect'}">
      <div class="quiz-explanation-title">${result.correct ? '✓ 回答正确！' : '✗ 不太对哦'}</div>
      ${!result.correct ? `<div style="margin-bottom: 8px; color: var(--gray-600);">正确答案：${result.correctAnswer}</div>` : ''}
      <div style="color: var(--gray-700); font-size: 14px;">${result.explanation}</div>
    </div>
    <button class="btn btn-primary" style="width: 100%; margin-top: 12px;" onclick="nextQuizQuestion()">
      ${questionIndex < (QuizData.getQuiz(LessonViewer.currentLesson?.id)?.questions.length || 1) - 1 ? '下一题' : '完成练习'}
    </button>
  `;

  currentQuestion.insertAdjacentHTML('beforeend', explanationHtml);
}

// 下一题
function nextQuizQuestion() {
  LessonViewer.currentQuizIndex++;
  renderQuizQuestion(LessonViewer.currentLesson?.id, LessonViewer.currentQuizIndex);
}

// 关闭练习弹窗
function closeQuiz() {
  document.getElementById('quiz-modal')?.classList.add('hidden');
}

// 导出到全局
window.openQuiz = openQuiz;
window.closeQuiz = closeQuiz;
window.renderQuizQuestion = renderQuizQuestion;
window.checkChoiceAnswer = checkChoiceAnswer;
window.checkFillAnswer = checkFillAnswer;
window.nextQuizQuestion = nextQuizQuestion;

// 导出到全局
window.App = App;
window.showToast = showToast;
window.closeModal = closeModal;

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
