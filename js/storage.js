// 本地存储管理

const Storage = {
  // 获取进度数据
  getProgress() {
    const data = localStorage.getItem('learning-progress');
    return data ? JSON.parse(data) : {};
  },

  // 保存进度数据
  saveProgress(progress) {
    localStorage.setItem('learning-progress', JSON.stringify(progress));
  },

  // 获取单个课程进度
  getLessonProgress(lessonId) {
    const progress = this.getProgress();
    return progress[lessonId] || null;
  },

  // 更新课程进度
  updateLessonProgress(lessonId, updates) {
    const progress = this.getProgress();
    const now = Date.now();

    if (!progress[lessonId]) {
      progress[lessonId] = {
        status: 'not-started',
        startedAt: null,
        completedAt: null,
        lastReviewedAt: null,
        timeSpentSeconds: 0,
        reviewCount: 0,
        masteryLevel: 0
      };
    }

    const current = progress[lessonId];

    // 合并更新
    Object.assign(current, updates);

    // 自动更新状态
    if (current.completedAt) {
      current.status = 'completed';
    }
    if (current.masteryLevel >= 0.7) {
      current.status = 'mastered';
    }

    progress[lessonId] = current;
    this.saveProgress(progress);

    // 触发事件
    window.dispatchEvent(new CustomEvent('progress-updated', {
      detail: { lessonId, progress: current }
    }));

    return current;
  },

  // 标记课程为开始学习
  startLesson(lessonId) {
    return this.updateLessonProgress(lessonId, {
      startedAt: Date.now(),
      status: 'learning'
    });
  },

  // 标记课程为完成
  completeLesson(lessonId, timeSpentSeconds = 0) {
    const progress = this.getLessonProgress(lessonId) || {};
    const prevTime = progress.timeSpentSeconds || 0;

    return this.updateLessonProgress(lessonId, {
      completedAt: Date.now(),
      timeSpentSeconds: prevTime + timeSpentSeconds,
      status: 'completed',
      masteryLevel: Math.max(progress.masteryLevel || 0, 0.5)
    });
  },

  // 复习课程（基于 SM-2 间隔重复算法）
  reviewLesson(lessonId, quality = 3) {
    const progress = this.getLessonProgress(lessonId) || {};

    // SM-2 算法参数
    const easeFactor = progress.easeFactor || 2.5; // 默认难度因子
    const interval = progress.interval || 1; // 间隔天数
    const repetition = progress.repetition || 0; // 重复次数

    // 根据评分质量更新参数
    // quality: 0-5 (0=完全忘记，5=完美回忆)
    if (quality >= 3) {
      // 正确回忆，增加间隔
      const newRepetition = repetition + 1;
      let newInterval;

      if (newRepetition === 1) {
        newInterval = 1;
      } else if (newRepetition === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * easeFactor);
      }

      // 更新难度因子
      const newEaseFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * 0.15);

      return this.updateLessonProgress(lessonId, {
        lastReviewedAt: Date.now(),
        repetition: newRepetition,
        interval: newInterval,
        easeFactor: newEaseFactor,
        masteryLevel: Math.min((progress.masteryLevel || 0) + 0.1, 1.0),
        status: newRepetition >= 5 ? 'mastered' : 'completed'
      });
    } else {
      // 忘记，重置间隔
      return this.updateLessonProgress(lessonId, {
        lastReviewedAt: Date.now(),
        repetition: 0,
        interval: 1,
        easeFactor: Math.max(1.3, easeFactor - 0.2),
        status: 'learning'
      });
    }
  },

  // 获取需要复习的课程（基于 SM-2 算法）
  getLessonsDueForReview() {
    const progress = this.getProgress();
    const now = Date.now();
    const dueLessons = [];

    Object.entries(progress).forEach(([lessonId, data]) => {
      if (data.status === 'completed' || data.status === 'mastered' || data.status === 'learning') {
        const lastReviewed = data.lastReviewedAt;
        const interval = data.interval || 1;

        // 计算下次复习时间
        const nextReviewTime = lastReviewed
          ? lastReviewed + (interval * 24 * 60 * 60 * 1000)
          : 0;

        // 如果已到期，添加到列表
        if (nextReviewTime <= now) {
          const daysOverdue = (now - nextReviewTime) / (24 * 60 * 60 * 1000);
          dueLessons.push({
            lessonId,
            daysOverdue: daysOverdue.toFixed(1),
            interval: interval,
            repetition: data.repetition || 0
          });
        }
      }
    });

    // 按逾期时间排序
    dueLessons.sort((a, b) => b.daysOverdue - a.daysOverdue);

    return dueLessons;
  },

  // 获取所有进度统计
  getStats() {
    const progress = this.getProgress();
    const lessons = Object.values(progress);

    const stats = {
      totalLessons: 0,
      notStarted: 0,
      learning: 0,
      completed: 0,
      mastered: 0,
      totalTimeSeconds: 0,
      totalReviews: 0
    };

    lessons.forEach(p => {
      stats.totalLessons++;
      if (p.status) stats[p.status]++;
      stats.totalTimeSeconds += (p.timeSpentSeconds || 0);
      stats.totalReviews += (p.reviewCount || 0);
    });

    // 计算总课程数（需要从内容获取）
    stats.totalLessons = this.getTotalLessons();
    stats.completionRate = stats.totalLessons > 0
      ? ((stats.completed + stats.mastered) / stats.totalLessons * 100).toFixed(1)
      : 0;

    return stats;
  },

  // 获取总课程数（从内容配置）
  getTotalLessons() {
    const content = window.CONTENT_DATA;
    if (!content || !content.chapters) return 0;

    return content.chapters.reduce((sum, chapter) => {
      return sum + (chapter.lessons ? chapter.lessons.length : 0);
    }, 0);
  },

  // 重置所有进度
  resetAllProgress() {
    localStorage.removeItem('learning-progress');
    window.dispatchEvent(new CustomEvent('progress-reset'));
  },

  // 获取需要复习的课程
  getLessonsDueForReview() {
    const progress = this.getProgress();
    const now = Date.now();
    const dueLessons = [];

    Object.entries(progress).forEach(([lessonId, data]) => {
      if (data.status === 'completed' || data.status === 'mastered') {
        const daysSinceReview = data.lastReviewedAt
          ? (now - data.lastReviewedAt) / (1000 * 60 * 60 * 24)
          : 999;

        // 简单间隔：7 天、14 天、30 天...
        const reviewInterval = 7 * Math.pow(2, data.reviewCount || 0);

        if (daysSinceReview >= reviewInterval) {
          dueLessons.push({
            lessonId,
            daysOverdue: (daysSinceReview - reviewInterval).toFixed(1)
          });
        }
      }
    });

    return dueLessons;
  },

  // 语言设置
  getLanguage() {
    const lang = localStorage.getItem('app-language');
    return lang || 'zh-CN'; // 默认中文
  },

  setLanguage(lang) {
    localStorage.setItem('app-language', lang);
    window.dispatchEvent(new CustomEvent('language-changed', {
      detail: { language: lang }
    }));
  },

  // 主题设置
  getTheme() {
    const theme = localStorage.getItem('app-theme');
    return theme || 'auto'; // 默认跟随系统
  },

  setTheme(theme) {
    localStorage.setItem('app-theme', theme);
    window.dispatchEvent(new CustomEvent('theme-changed', {
      detail: { theme }
    }));
  },

  // 应用主题
  applyTheme(theme) {
    const actualTheme = theme === 'auto'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    document.documentElement.setAttribute('data-theme', actualTheme);

    // 更新 PWA 主题色
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', actualTheme === 'dark' ? '#1E1E1E' : '#4A90D9');
    }
  },

  // 获取当前学习的课程
  getCurrentLesson() {
    const progress = this.getProgress();

    // 找到最近开始但未完成的课程
    for (const [lessonId, data] of Object.entries(progress)) {
      if (data.status === 'learning' || (data.startedAt && !data.completedAt)) {
        return lessonId;
      }
    }

    // 如果没有进行中的，返回第一个未开始的课程
    const content = window.CONTENT_DATA;
    if (content && content.chapters) {
      for (const chapter of content.chapters) {
        for (const lesson of (chapter.lessons || [])) {
          if (!progress[lesson.id]) {
            return lesson.id;
          }
        }
      }
    }

    return null;
  },

  // 书签功能
  getBookmarks() {
    const bookmarks = localStorage.getItem('app-bookmarks');
    return bookmarks ? JSON.parse(bookmarks) : [];
  },

  addBookmark(lessonId) {
    const bookmarks = this.getBookmarks();
    if (!bookmarks.includes(lessonId)) {
      bookmarks.push(lessonId);
      localStorage.setItem('app-bookmarks', JSON.stringify(bookmarks));
      window.dispatchEvent(new CustomEvent('bookmarks-changed', {
        detail: { bookmarks }
      }));
      return true;
    }
    return false;
  },

  removeBookmark(lessonId) {
    const bookmarks = this.getBookmarks();
    const index = bookmarks.indexOf(lessonId);
    if (index > -1) {
      bookmarks.splice(index, 1);
      localStorage.setItem('app-bookmarks', JSON.stringify(bookmarks));
      window.dispatchEvent(new CustomEvent('bookmarks-changed', {
        detail: { bookmarks }
      }));
      return true;
    }
    return false;
  },

  toggleBookmark(lessonId) {
    if (this.isBookmarked(lessonId)) {
      this.removeBookmark(lessonId);
      return false;
    } else {
      this.addBookmark(lessonId);
      return true;
    }
  },

  isBookmarked(lessonId) {
    const bookmarks = this.getBookmarks();
    return bookmarks.includes(lessonId);
  },

  getBookmarkedLessons() {
    const bookmarks = this.getBookmarks();
    const lessons = [];

    for (const lessonId of bookmarks) {
      const lesson = Content.getLesson(lessonId);
      if (lesson) {
        lessons.push(lesson);
      }
    }

    return lessons;
  },

  // 错题本功能
  getWrongAnswers() {
    const wrongAnswers = localStorage.getItem('app-wrong-answers');
    return wrongAnswers ? JSON.parse(wrongAnswers) : [];
  },

  // 添加错题
  addWrongAnswer(lessonId, questionIndex, userAnswer, correctAnswer, explanation) {
    const wrongAnswers = this.getWrongAnswers();
    const now = Date.now();

    const newWrongAnswer = {
      id: `${lessonId}-${questionIndex}-${now}`,
      lessonId,
      questionIndex,
      userAnswer,
      correctAnswer,
      explanation,
      createdAt: now,
      reviewCount: 0,
      lastReviewedAt: null,
      mastered: false
    };

    // 检查是否已存在相同的错题
    const exists = wrongAnswers.some(wa =>
      wa.lessonId === lessonId && wa.questionIndex === questionIndex && !wa.mastered
    );

    if (!exists) {
      wrongAnswers.push(newWrongAnswer);
      localStorage.setItem('app-wrong-answers', JSON.stringify(wrongAnswers));
      window.dispatchEvent(new CustomEvent('wrong-answers-changed', {
        detail: { wrongAnswers }
      }));
      return true;
    }
    return false;
  },

  // 标记错题已掌握
  masterWrongAnswer(wrongAnswerId) {
    const wrongAnswers = this.getWrongAnswers();
    const index = wrongAnswers.findIndex(wa => wa.id === wrongAnswerId);

    if (index > -1) {
      wrongAnswers[index].mastered = true;
      wrongAnswers[index].lastReviewedAt = Date.now();
      localStorage.setItem('app-wrong-answers', JSON.stringify(wrongAnswers));
      window.dispatchEvent(new CustomEvent('wrong-answers-changed', {
        detail: { wrongAnswers }
      }));
      return true;
    }
    return false;
  },

  // 移除错题
  removeWrongAnswer(wrongAnswerId) {
    const wrongAnswers = this.getWrongAnswers();
    const index = wrongAnswers.findIndex(wa => wa.id === wrongAnswerId);

    if (index > -1) {
      wrongAnswers.splice(index, 1);
      localStorage.setItem('app-wrong-answers', JSON.stringify(wrongAnswers));
      window.dispatchEvent(new CustomEvent('wrong-answers-changed', {
        detail: { wrongAnswers }
      }));
      return true;
    }
    return false;
  },

  // 获取未掌握的错题
  getActiveWrongAnswers() {
    const wrongAnswers = this.getWrongAnswers();
    return wrongAnswers.filter(wa => !wa.mastered);
  },

  // 获取错题统计
  getWrongAnswerStats() {
    const wrongAnswers = this.getWrongAnswers();
    const active = wrongAnswers.filter(wa => !wa.mastered);
    const mastered = wrongAnswers.filter(wa => wa.mastered);

    return {
      total: wrongAnswers.length,
      active: active.length,
      mastered: mastered.length,
      masteryRate: wrongAnswers.length > 0
        ? ((mastered.length / wrongAnswers.length) * 100).toFixed(1)
        : 0
    };
  },

  // 成就系统
  getAchievements() {
    const achievements = localStorage.getItem('app-achievements');
    return achievements ? JSON.parse(achievements) : [];
  },

  // 检查并解锁成就
  checkAndUnlockAchievement(achievementId) {
    const achievements = this.getAchievements();
    const alreadyUnlocked = achievements.some(a => a.id === achievementId);

    if (alreadyUnlocked) return false;

    const achievement = this.getAchievementDefinition(achievementId);
    if (!achievement) return false;

    // 检查成就是否达成
    if (this.checkAchievementCondition(achievement)) {
      const newAchievement = {
        ...achievement,
        unlockedAt: Date.now()
      };
      achievements.push(newAchievement);
      localStorage.setItem('app-achievements', JSON.stringify(achievements));
      window.dispatchEvent(new CustomEvent('achievement-unlocked', {
        detail: { achievement: newAchievement }
      }));
      return true;
    }
    return false;
  },

  // 获取成就定义
  getAchievementDefinition(achievementId) {
    const definitions = this.getAchievementDefinitions();
    return definitions.find(a => a.id === achievementId);
  },

  // 所有成就定义
  getAchievementDefinitions() {
    return [
      { id: 'first_lesson', name: '第一步', description: '完成第一节课', icon: '🎯', condition: { type: 'completedLessons', count: 1 } },
      { id: 'five_lessons', name: '初学者', description: '完成 5 节课', icon: '📚', condition: { type: 'completedLessons', count: 5 } },
      { id: 'ten_lessons', name: '进取者', description: '完成 10 节课', icon: '🏆', condition: { type: 'completedLessons', count: 10 } },
      { id: 'twenty_lessons', name: '学霸', description: '完成 20 节课', icon: '🎓', condition: { type: 'completedLessons', count: 20 } },
      { id: 'streak_3days', name: '坚持 3 天', description: '连续学习 3 天', icon: '🔥', condition: { type: 'streak', days: 3 } },
      { id: 'streak_7days', name: '一周挑战', description: '连续学习 7 天', icon: '🔥🔥', condition: { type: 'streak', days: 7 } },
      { id: 'streak_30days', name: '月度达人', description: '连续学习 30 天', icon: '🔥🔥🔥', condition: { type: 'streak', days: 30 } },
      { id: 'perfect_quiz', name: '全对！', description: '一次练习全对', icon: '💯', condition: { type: 'perfectQuiz' } },
      { id: 'master_5', name: '精通 5 课', description: '精通 5 节课', icon: '⭐', condition: { type: 'masteredLessons', count: 5 } },
      { id: 'review_10', name: '复习达人', description: '复习 10 次', icon: '🔄', condition: { type: 'reviewCount', count: 10 } }
    ];
  },

  // 检查成就条件
  checkAchievementCondition(achievement) {
    const stats = this.getStats();

    switch (achievement.condition.type) {
      case 'completedLessons':
        return (stats.completed + stats.mastered) >= achievement.condition.count;
      case 'masteredLessons':
        return stats.mastered >= achievement.condition.count;
      case 'streak':
        return this.getLearningStreak() >= achievement.condition.days;
      case 'reviewCount':
        return stats.totalReviews >= achievement.condition.count;
      case 'perfectQuiz':
        // 需要额外记录
        return false;
      default:
        return false;
    }
  },

  // 获取连续学习天数
  getLearningStreak() {
    const progress = this.getProgress();
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // 获取所有课程的学习日期
    const learningDates = new Set();

    Object.values(progress).forEach(p => {
      if (p.startedAt) {
        const date = new Date(p.startedAt).toDateString();
        learningDates.add(date);
      }
    });

    // 计算连续天数
    let streak = 0;
    let currentDate = new Date(now);

    // 从今天往前数
    while (true) {
      const dateStr = currentDate.toDateString();
      if (learningDates.has(dateStr)) {
        streak++;
        currentDate = new Date(currentDate.getTime() - oneDay);
      } else if (dateStr === new Date().toDateString()) {
        // 今天还没学，但如果之前学了也算连续
        currentDate = new Date(currentDate.getTime() - oneDay);
      } else {
        break;
      }

      if (streak > 365) break; // 防止死循环
    }

    return streak;
  },

  // 记录完美练习
  recordPerfectQuiz() {
    const perfectQuizzes = localStorage.getItem('app-perfect-quizzes');
    const count = perfectQuizzes ? parseInt(perfectQuizzes) : 0;
    localStorage.setItem('app-perfect-quizzes', String(count + 1));
    this.checkAndUnlockAchievement('perfect_quiz');
  },

  // 费曼模式记录
  getFeynmanRecords() {
    const records = localStorage.getItem('app-feynman-records');
    return records ? JSON.parse(records) : [];
  },

  // 保存费曼解释
  saveFeynmanRecord(lessonId, explanation) {
    const records = this.getFeynmanRecords();
    const newRecord = {
      id: `${lessonId}-${Date.now()}`,
      lessonId,
      explanation,
      createdAt: Date.now()
    };

    // 添加到开头
    records.unshift(newRecord);

    // 限制每个课程最多保存 10 条
    const lessonRecords = records.filter(r => r.lessonId === lessonId);
    if (lessonRecords.length > 10) {
      const toRemove = lessonRecords[lessonRecords.length - 1];
      const index = records.findIndex(r => r.id === toRemove.id);
      if (index > -1) records.splice(index, 1);
    }

    localStorage.setItem('app-feynman-records', JSON.stringify(records));
    return newRecord;
  },

  // 获取课程的费曼记录
  getLessonFeynmanRecords(lessonId) {
    const records = this.getFeynmanRecords();
    return records.filter(r => r.lessonId === lessonId);
  }
};

// 导出到全局
window.Storage = Storage;
