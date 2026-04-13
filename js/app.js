// 主应用逻辑

const App = {
  // 当前页面
  currentPage: 'skill-tree',

  // 设置状态管理（用于取消/关闭时恢复）
  settingsOriginalState: null,

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
    // 临时状态管理（用于取消/保存功能）
    const originalSettings = {
      theme: Storage.getTheme(),
      language: Storage.getLanguage()
    };
    let tempSettings = { ...originalSettings };

    // 设置按钮 - 打开时保存原始状态
    document.getElementById('settings-btn')?.addEventListener('click', () => {
      // 保存原始状态用于取消时恢复
      originalSettings.theme = Storage.getTheme();
      originalSettings.language = Storage.getLanguage();
      tempSettings = { ...originalSettings };

      // 保存到全局状态，供关闭按钮使用
      App.settingsOriginalState = { ...originalSettings };

      const modal = document.getElementById('settings-modal');
      modal?.classList.remove('hidden');

      // 更新按钮状态
      this.updateSettingsButtonState(originalSettings, tempSettings);
    });

    // 取消按钮
    document.getElementById('settings-cancel')?.addEventListener('click', () => {
      // 清除原始状态
      App.settingsOriginalState = null;

      // 关闭弹窗
      document.getElementById('settings-modal')?.classList.add('hidden');
      // 恢复原始状态
      Storage.setTheme(originalSettings.theme);
      Storage.setLanguage(originalSettings.language);
      Storage.applyTheme(originalSettings.theme);
      document.documentElement.lang = originalSettings.language;
      showToast('已取消更改');
    });

    // 保存按钮
    document.getElementById('settings-save')?.addEventListener('click', () => {
      if (!tempSettings) return;

      // 应用更改
      Storage.setTheme(tempSettings.theme);
      Storage.setLanguage(tempSettings.language);
      Storage.applyTheme(tempSettings.theme);
      document.documentElement.lang = tempSettings.language;

      // 清除原始状态（已保存）
      App.settingsOriginalState = null;

      // 关闭弹窗
      document.getElementById('settings-modal')?.classList.add('hidden');

      // 如果语言改变了，需要重新加载内容
      if (tempSettings.language !== originalSettings.language) {
        const contentPack = tempSettings.language === 'en-US' ? 'en' : 'math-cs-ai';
        Content.load(contentPack).then(() => {
          this.refreshCurrentPage();
          if (LessonViewer.currentLesson) {
            LessonViewer.refresh();
          }
        });
        showToast('语言已更改，内容已刷新');
      } else {
        showToast('设置已保存');
      }

      // 重置临时状态
      tempSettings = null;
    });

    // 语言选择器
    this.bindLanguageSelector(tempSettings);

    // 主题选择器
    this.bindThemeSelector(tempSettings);

    // 内容包按钮（在设置里面）
    document.getElementById('content-pack-btn')?.addEventListener('click', () => {
      this.showContentPackModal();
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

  // 更新设置按钮状态（检测是否有更改）
  updateSettingsButtonState(original, temp) {
    const saveBtn = document.getElementById('settings-save');
    if (!saveBtn) return;

    const hasChanges = JSON.stringify(original) !== JSON.stringify(temp);
    saveBtn.disabled = !hasChanges;
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

    // 确保 stats 有默认值
    const completionRate = stats?.completionRate ?? '0.0';
    const completedCount = (stats?.completed ?? 0) + (stats?.mastered ?? 0);
    const masteredCount = stats?.mastered ?? 0;
    const dueReviewCount = dueReviews?.length ?? 0;

    container.innerHTML = `
      <div class="dashboard-container">

        <!-- 继续学习卡片 -->
        ${currentLesson ? `
          <div class="dashboard-card continue-learning">
            <div class="card-header">
              <span class="card-badge">当前课程</span>
            </div>
            <div class="card-body">
              <div class="lesson-main">
                <div class="lesson-title-large">${currentLessonData?.title || '未知课程'}</div>
                <div class="lesson-chapter">📚 ${Content.getChapter(currentLessonData?.chapterId)?.title || ''}</div>
              </div>
              <button class="btn-continue" onclick="App.continueLearning()">
                继续学习
                <span class="btn-arrow">→</span>
              </button>
            </div>
          </div>
        ` : `
          <div class="dashboard-card empty-state-card">
            <div class="empty-state-content">
              <div class="empty-icon">🎯</div>
              <div class="empty-title">开始你的学习之旅</div>
              <div class="empty-description">从第一章开始，循序渐进掌握知识</div>
              <button class="btn-start" onclick="App.startFirstLesson()">
                开始第一章
              </button>
            </div>
          </div>
        `}

        <!-- 统计概览 - 一行显示 -->
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-icon completion">📊</div>
            <div class="stat-info">
              <div class="stat-value">${completionRate}%</div>
              <div class="stat-label">完成率</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon completed">✅</div>
            <div class="stat-info">
              <div class="stat-value">${completedCount}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon mastered">🏆</div>
            <div class="stat-info">
              <div class="stat-value">${masteredCount}</div>
              <div class="stat-label">已精通</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon review">📝</div>
            <div class="stat-info">
              <div class="stat-value">${dueReviewCount}</div>
              <div class="stat-label">待复习</div>
            </div>
          </div>
        </div>

        <!-- 学习时长和连续学习 -->
        <div class="info-grid">
          <div class="info-card time">
            <div class="info-icon">⏱️</div>
            <div class="info-content">
              <div class="info-value">${ProgressManager.formatTime(stats.totalTimeSeconds)}</div>
              <div class="info-label">总学习时长</div>
            </div>
          </div>
          ${(() => {
            const streak = Storage.getLearningStreak();
            return `<div class="info-card streak${streak >= 7 ? ' streak-fire' : ''}">
              <div class="info-icon">🔥</div>
              <div class="info-content">
                <div class="info-value">${streak} 天</div>
                <div class="info-label">连续学习</div>
              </div>
            </div>`;
          })()}
        </div>

        <!-- 待复习课程 -->
        ${dueReviews.length > 0 ? `
          <div class="dashboard-section">
            <div class="section-header">
              <h3 class="section-title">待复习</h3>
              <span class="section-count">${dueReviews.length}</span>
            </div>
            <div class="review-list">
              ${dueReviews.slice(0, 5).map(item => {
                const lesson = Content.getLesson(item.lessonId);
                return `
                  <div class="review-item" onclick="App.reviewLesson('${item.lessonId}')">
                    <div class="review-icon">📚</div>
                    <div class="review-info">
                      <div class="review-title">${lesson?.title || item.lessonId}</div>
                      <div class="review-days">逾期 ${item.daysOverdue} 天</div>
                    </div>
                    <div class="review-arrow">›</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 成就徽章 -->
        <div class="dashboard-section">
          <div class="section-header">
            <h3 class="section-title">成就徽章</h3>
            <span class="section-count">${Storage.getAchievements().length}</span>
          </div>
          ${this.renderAchievementsSection()}
        </div>

        <!-- 错题本 -->
        <div class="dashboard-section">
          <div class="section-header">
            <h3 class="section-title">错题本</h3>
            ${this.renderWrongAnswersSummary()}
          </div>
          ${this.renderWrongAnswersSection()}
        </div>

        <!-- 我的收藏 -->
        <div class="dashboard-section">
          <div class="section-header">
            <h3 class="section-title">我的收藏</h3>
            <span class="section-count">${Storage.getBookmarkedLessons().length}</span>
          </div>
          ${this.renderBookmarksSection()}
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
        <div style="margin-top: 12px; font-size: 13px; color: var(--text-secondary);">
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
        <div class="wrong-answers-summary">
          <div class="wrong-answer-stat">
            <div class="wrong-answer-value danger">${stats.active}</div>
            <div class="wrong-answer-label">待掌握</div>
          </div>
          <div class="wrong-answer-divider"></div>
          <div class="wrong-answer-stat">
            <div class="wrong-answer-value success">${stats.mastered}</div>
            <div class="wrong-answer-label">已掌握</div>
          </div>
          <div class="wrong-answer-divider"></div>
          <div class="wrong-answer-stat">
            <div class="wrong-answer-value primary">${stats.masteryRate}%</div>
            <div class="wrong-answer-label">掌握率</div>
          </div>
        </div>
        ${activeWrongAnswers.length > 0 ? `
          <div class="wrong-answers-recent">
            <div class="wrong-answers-recent-title">最近错题</div>
            ${activeWrongAnswers.slice(0, 3).map(wa => {
              const lesson = Content.getLesson(wa.lessonId);
              return `<div class="wrong-answer-item">${lesson?.title || wa.lessonId}</div>`;
            }).join('')}
          </div>
        ` : ''}
      </div>
    `;
  },

  // 渲染错题本摘要（小图标）
  renderWrongAnswersSummary() {
    const stats = Storage.getWrongAnswerStats();
    if (stats.total === 0) {
      return '<span class="section-count all-good">✓ 全对</span>';
    }
    return `<span class="section-count has-wrong">${stats.active} 待掌握</span>`;
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
    const weeklyData = this.getWeeklyLearningData();
    const domainStats = this.getDomainStats(chapters);
    const recommendedLessons = this.getRecommendedLessons(chapters);

    container.innerHTML = `
      <div class="progress-page-container">
        <!-- 总体进度概览 -->
        <div class="progress-section">
          <h2 class="progress-section-title">📊 学习概览</h2>
          <div class="progress-overview-grid">
            <div class="progress-stat-card">
              <div class="progress-stat-icon">📚</div>
              <div class="progress-stat-value">${stats.completed + stats.mastered}</div>
              <div class="progress-stat-label">已完成课程</div>
              <div class="progress-stat-sub">${stats.totalLessons} 节总数</div>
            </div>
            <div class="progress-stat-card">
              <div class="progress-stat-icon">⏱️</div>
              <div class="progress-stat-value">${ProgressManager.formatTime(stats.totalTimeSeconds)}</div>
              <div class="progress-stat-label">学习时长</div>
              <div class="progress-stat-sub">累计投入</div>
            </div>
            <div class="progress-stat-card">
              <div class="progress-stat-icon">🏆</div>
              <div class="progress-stat-value">${stats.mastered}</div>
              <div class="progress-stat-label">已精通课程</div>
              <div class="progress-stat-sub">深度学习</div>
            </div>
            <div class="progress-stat-card">
              <div class="progress-stat-icon">🔥</div>
              <div class="progress-stat-value">${this.getCurrentStreak()}</div>
              <div class="progress-stat-label">连续学习天数</div>
              <div class="progress-stat-sub">坚持不懈</div>
            </div>
          </div>
        </div>

        <!-- 总体进度条 -->
        <div class="progress-section">
          <h2 class="progress-section-title">📈 总体进度</h2>
          <div class="card progress-main-card">
            <div class="progress-main-content">
              <div class="progress-circle-container">
                <svg viewBox="0 0 120 120" class="progress-circle">
                  <circle class="progress-circle-bg" cx="60" cy="60" r="52" />
                  <circle class="progress-circle-fill" cx="60" cy="60" r="52"
                          style="stroke-dasharray: ${2 * Math.PI * 52}; stroke-dashoffset: ${2 * Math.PI * 52 * (1 - stats.completionRate / 100)}" />
                  <text class="progress-circle-text" x="60" y="60">${stats.completionRate}%</text>
                </svg>
              </div>
              <div class="progress-main-info">
                <div class="progress-main-title">课程完成度</div>
                <div class="progress-main-desc">
                  已完成 <span class="highlight">${stats.completed + stats.mastered}</span> 节，
                  还剩 <span class="highlight">${stats.totalLessons - stats.completed - stats.mastered}</span> 节
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${stats.completionRate}%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分领域进度 -->
        <div class="progress-section">
          <h2 class="progress-section-title">📚 分领域进度</h2>
          <div class="domain-progress-grid">
            ${Object.entries(domainStats).map(([domain, data]) => `
              <div class="domain-card domain-${domain}">
                <div class="domain-header">
                  <span class="domain-icon">${data.icon}</span>
                  <span class="domain-name">${data.name}</span>
                </div>
                <div class="domain-progress-bar">
                  <div class="domain-progress-fill" style="width: ${data.percent}%"></div>
                </div>
                <div class="domain-footer">
                  <span>${data.completed}/${data.total} 完成</span>
                  <span class="domain-percent">${data.percent}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 学习时间趋势 -->
        <div class="progress-section">
          <h2 class="progress-section-title">📅 学习时间趋势</h2>
          <div class="card">
            <div class="weekly-chart">
              ${weeklyData.map((day, index) => `
                <div class="weekly-bar-container">
                  <div class="weekly-bar" style="height: ${day.percent}%"></div>
                  <div class="weekly-label">${day.label}</div>
                  <div class="weekly-value">${day.minutes}m</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- 推荐学习 -->
        <div class="progress-section">
          <h2 class="progress-section-title">💡 推荐学习</h2>
          ${recommendedLessons.length > 0 ? `
            <div class="recommendation-list">
              ${recommendedLessons.map((lesson, index) => `
                <div class="recommendation-item" data-lesson-id="${lesson.id}">
                  <div class="recommendation-rank">#${index + 1}</div>
                  <div class="recommendation-info">
                    <div class="recommendation-title">${lesson.title}</div>
                    <div class="recommendation-chapter">${lesson.chapterTitle}</div>
                  </div>
                  <div class="recommendation-reason">${lesson.reason}</div>
                  <button class="recommendation-btn">开始学习</button>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="card">
              <div class="empty-state-small">
                <div class="empty-icon">🎉</div>
                <div class="empty-title">太棒了！</div>
                <div class="empty-description">你已经完成了所有课程，继续保持复习哦~</div>
              </div>
            </div>
          `}
        </div>

        <!-- 章节进度详情 -->
        <div class="progress-section">
          <h2 class="progress-section-title">📖 章节进度详情</h2>
          <div class="chapter-progress-list">
            ${chapters.map(chapter => {
              const progress = Content.getChapterProgress(chapter);
              return `
                <div class="chapter-progress-item">
                  <div class="chapter-info">
                    <div class="chapter-number">第${chapter.order}章</div>
                    <div class="chapter-title">${chapter.title}</div>
                  </div>
                  <div class="chapter-progress-right">
                    <div class="chapter-progress-percent">${progress}%</div>
                    <div class="chapter-progress-bar">
                      <div class="chapter-progress-fill" style="width: ${progress}%"></div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    // 绑定推荐学习点击事件
    this.bindRecommendationEvents(container);
  },

  // 获取每周学习数据
  getWeeklyLearningData() {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    const today = new Date();
    const weeklyData = [];
    let maxMinutes = 1; // 防止除以 0

    // 获取过去 7 天的数据
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayIndex = date.getDay();
      const minutes = Storage.getDayLearningTime(dateStr) || 0;

      if (minutes > maxMinutes) maxMinutes = minutes;

      weeklyData.push({
        label: days[dayIndex],
        minutes: minutes,
        percent: 0, // 稍后计算
        date: dateStr
      });
    }

    // 计算百分比
    weeklyData.forEach(day => {
      day.percent = Math.round((day.minutes / maxMinutes) * 100);
    });

    return weeklyData;
  },

  // 获取分领域统计
  getDomainStats(chapters) {
    const domains = {
      'math': { id: 'math', name: '数学基础', icon: '📐', completed: 0, total: 0 },
      'ai': { id: 'ai', name: '人工智能', icon: '🤖', completed: 0, total: 0 },
      'cs': { id: 'cs', name: '计算机科学', icon: '💻', completed: 0, total: 0 },
      'system': { id: 'system', name: '系统工程', icon: '⚙️', completed: 0, total: 0 }
    };

    for (const chapter of chapters) {
      const domain = this.getChapterDomain(chapter);
      if (domains[domain]) {
        const lessons = chapter.lessons || [];
        domains[domain].total += lessons.length;
        domains[domain].completed += lessons.filter(l => {
          const p = Storage.getLessonProgress(l.id);
          return p && (p.status === 'completed' || p.status === 'mastered');
        }).length;
      }
    }

    // 计算百分比
    Object.values(domains).forEach(d => {
      d.percent = d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0;
    });

    return domains;
  },

  // 获取章节所属领域
  getChapterDomain(chapter) {
    const id = chapter.id || '';
    const title = (chapter.title || '').toLowerCase();

    if (id.match(/ch0[1-5]/) || title.includes('向量') || title.includes('矩阵') ||
        title.includes('微积分') || title.includes('统计') || title.includes('概率')) {
      return 'math';
    }
    if (id.match(/ch0[6-9]|ch1[0-8]|ch19|ch20/) || title.includes('机器学习') ||
        title.includes('NLP') || title.includes('视觉') || title.includes('音频') ||
        title.includes('多模态') || title.includes('AI')) {
      return 'ai';
    }
    if (id.match(/ch1[1-5]/) || title.includes('图网络') || title.includes('算法')) {
      return 'cs';
    }
    return 'system';
  },

  // 获取推荐课程
  getRecommendedLessons(chapters) {
    const recommendations = [];

    // 优先级 1：学习中的课程
    for (const chapter of chapters) {
      for (const lesson of (chapter.lessons || [])) {
        const progress = Storage.getLessonProgress(lesson.id);
        if (progress?.status === 'learning') {
          recommendations.push({
            id: lesson.id,
            title: lesson.title,
            chapterTitle: chapter.title,
            reason: '继续学习',
            priority: 1
          });
        }
      }
    }

    // 优先级 2：未开始的基础课程（第 1-2 章）
    if (recommendations.length === 0) {
      for (const chapter of chapters.filter(c => c.order <= 2)) {
        for (const lesson of (chapter.lessons || [])) {
          const progress = Storage.getLessonProgress(lesson.id);
          if (!progress || progress.status === 'not-started') {
            recommendations.push({
              id: lesson.id,
              title: lesson.title,
              chapterTitle: chapter.title,
              reason: '基础课程',
              priority: 2
            });
          }
        }
      }
    }

    // 优先级 3：需要复习的课程（超过 7 天未学习）
    const dueLessons = Storage.getLessonsDueForReview();
    dueLessons.slice(0, 3).forEach(lessonId => {
      const lesson = Content.getLesson(lessonId);
      if (lesson && !recommendations.find(r => r.id === lessonId)) {
        recommendations.push({
          id: lesson.id,
          title: lesson.title,
          chapterTitle: lesson.chapter || '未知章节',
          reason: '需要复习',
          priority: 3
        });
      }
    });

    return recommendations.slice(0, 5);
  },

  // 获取当前连续学习天数
  getCurrentStreak() {
    const stats = Storage.getStats();
    return stats.streak || 0;
  },

  // 绑定推荐事件
  bindRecommendationEvents(container) {
    container.querySelectorAll('.recommendation-item, .recommendation-btn').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = el.closest('.recommendation-item');
        const lessonId = item?.dataset.lessonId;
        if (lessonId) {
          window.SkillTree?.openLesson(lessonId);
        }
      });
    });
  },

  // 显示内容包选择弹窗
  showContentPackModal() {
    const modal = document.getElementById('content-pack-modal');
    const list = document.getElementById('content-pack-list');

    const packs = Content.getPacks();
    list.innerHTML = packs.map(pack => `
      <div class="pack-item ${Content.activePack === pack.id ? 'active' : ''}" onclick="App.switchContentPack('${pack.id}')">
        <div style="font-weight: 600; font-size: 16px;">${pack.name}</div>
        <div style="color: var(--text-secondary); font-size: 13px;">${pack.description}</div>
        <div style="color: var(--text-tertiary); font-size: 12px; margin-top: 4px;">${pack.chapters} 章节</div>
      </div>
    `).join('');

    modal?.classList.remove('hidden');
  },

  // 绑定语言选择器（使用临时状态）
  bindLanguageSelector(tempSettingsRef) {
    const buttons = document.querySelectorAll('.language-btn');
    // 从临时状态读取当前语言（支持取消后重新打开时显示正确状态）
    const currentLang = tempSettingsRef?.language || Storage.getLanguage();

    // 更新 HTML lang 属性（只在保存时真正修改）
    if (!tempSettingsRef) {
      document.documentElement.lang = currentLang;
    }

    buttons.forEach(btn => {
      if (btn.dataset.lang === currentLang) {
        btn.classList.add('active');
      }
      btn.addEventListener('click', () => {
        const newLang = btn.dataset.lang;

        // 更新临时状态而不是直接应用
        if (tempSettingsRef) {
          tempSettingsRef.language = newLang;
          this.updateSettingsButtonState({ language: Storage.getLanguage(), theme: Storage.getTheme() }, tempSettingsRef);
        }

        // 更新激活状态（视觉反馈）
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        showToast(`语言已选择：${newLang === 'zh-CN' ? '中文' : 'English'}（需保存才生效）`);
      });
    });
  },

  // 绑定主题选择器（使用临时状态）
  bindThemeSelector(tempSettingsRef) {
    const buttons = document.querySelectorAll('.theme-btn');
    // 从临时状态读取当前主题（支持取消后重新打开时显示正确状态）
    const currentTheme = tempSettingsRef?.theme || Storage.getTheme();

    buttons.forEach(btn => {
      if (btn.dataset.theme === currentTheme) {
        btn.classList.add('active');
      }
      btn.addEventListener('click', () => {
        const newTheme = btn.dataset.theme;

        // 更新临时状态而不是直接应用
        if (tempSettingsRef) {
          tempSettingsRef.theme = newTheme;
          this.updateSettingsButtonState({ language: Storage.getLanguage(), theme: Storage.getTheme() }, tempSettingsRef);
        }

        // 更新激活状态（视觉反馈）
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const themeNames = { 'light': '浅色', 'dark': '暗色', 'auto': '跟随系统' };
        showToast(`主题已选择：${themeNames[newTheme] || '自动'}（需保存才生效）`);
      });
    });

    // 监听系统主题变化（当设置为自动时，只在设置内预览，不立即应用）
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // 设置打开时不响应系统主题变化，避免干扰用户预览
      if (!document.getElementById('settings-modal')?.classList.contains('hidden')) {
        return;
      }
      if (Storage.getTheme() === 'auto') {
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

// 关闭设置弹窗（"完成"按钮 - 放弃未保存的更改）
function closeSettingsModal() {
  const modal = document.getElementById('settings-modal');
  if (modal) {
    // 如果用户没有保存更改，关闭时恢复原始状态
    // 这允许用户"只是看看"而不做永久更改
    if (App.settingsOriginalState) {
      // 恢复主题和语言到原始状态
      Storage.applyTheme(App.settingsOriginalState.theme);
      document.documentElement.lang = App.settingsOriginalState.language;
      App.settingsOriginalState = null;
    }
    modal.classList.add('hidden');
  }
}

function closeModal(modalId) {
  document.getElementById(modalId)?.classList.add('hidden');
}

// 显示成就解锁提示
function showAchievementToast(achievement) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.className = 'toast achievement'; // 使用成就样式
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

    // 创建星星爆炸效果
    if (window.CelebrationEffect) {
      setTimeout(() => {
        const toastRect = toast.getBoundingClientRect();
        CelebrationEffect.createStars(
          toastRect.left + toastRect.width / 2,
          toastRect.top
        );
      }, 200);
    }

    setTimeout(() => {
      toast.classList.add('hidden');
      toast.className = 'toast'; // 恢复默认样式
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
        <div style="color: var(--text-secondary); font-size: 14px; margin-top: 8px;">
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
      ${!result.correct ? `<div style="margin-bottom: 8px; color: var(--text-secondary);">正确答案：${result.correctAnswer}</div>` : ''}
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
