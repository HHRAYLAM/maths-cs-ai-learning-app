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

  // 复习课程
  reviewLesson(lessonId) {
    const progress = this.getLessonProgress(lessonId) || {};
    const newReviewCount = (progress.reviewCount || 0) + 1;

    // 每次复习增加掌握度 10%，最多到 1.0
    const newMastery = Math.min((progress.masteryLevel || 0) + 0.1, 1.0);

    return this.updateLessonProgress(lessonId, {
      lastReviewedAt: Date.now(),
      reviewCount: newReviewCount,
      masteryLevel: newMastery,
      status: newMastery >= 0.7 ? 'mastered' : 'completed'
    });
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
  }
};

// 导出到全局
window.Storage = Storage;
