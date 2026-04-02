// 主应用逻辑

const App = {
  // 当前页面
  currentPage: 'skill-tree',

  // 初始化
  async init() {
    console.log('应用初始化...');

    // 初始化练习题数据
    QuizData.init();

    // 加载内容
    await Content.load('math-cs-ai');

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

    container.innerHTML = `
      <div class="dashboard-container">
        <!-- 统计卡片 -->
        <div class="dashboard-section">
          <h2 class="dashboard-section-title">学习统计</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${summary.completionRate}</div>
              <div class="stat-label">完成率</div>
            </div>
            <div class="stat-card green">
              <div class="stat-value">${summary.completedLessons}/${summary.totalLessons}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="stat-card orange">
              <div class="stat-value">${summary.masteredLessons}</div>
              <div class="stat-label">已精通</div>
            </div>
            <div class="stat-card purple">
              <div class="stat-value">${summary.dueForReview}</div>
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
                ${summary.totalTime}
              </div>
              <div style="color: var(--gray-500); margin-top: 8px;">累计学习</div>
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
                  <div class="recent-lesson-item" style="cursor: pointer;" onclick="LessonViewer.open('${item.lessonId}')">
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

        <!-- 继续学习 -->
        <div class="dashboard-section">
          <h2 class="dashboard-section-title">继续学习</h2>
          <div class="card">
            <button class="btn btn-primary" style="width: 100%;" onclick="App.continueLearning()">
              开始学习
            </button>
          </div>
        </div>
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

  // 切换内容包
  async switchContentPack(packId) {
    await Content.load(packId);
    document.getElementById('content-pack-modal')?.classList.add('hidden');
    this.refreshCurrentPage();
    showToast(`已切换到 ${packId}`);
  },

  // 继续学习
  continueLearning() {
    const currentLesson = Storage.getCurrentLesson();
    if (currentLesson) {
      LessonViewer.open(currentLesson);
    } else {
      // 从第一章第一节课开始
      const chapters = Content.getChapters();
      const firstLesson = chapters[0]?.lessons?.[0];
      if (firstLesson) {
        LessonViewer.open(firstLesson.id);
      } else {
        showToast('暂无可学习内容');
      }
    }
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
