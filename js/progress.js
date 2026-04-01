// 进度追踪和管理

const ProgressManager = {
  // 当前学习计时
  currentLessonId: null,
  startTime: null,
  timerInterval: null,

  // 开始学习课程
  startLearning(lessonId) {
    this.currentLessonId = lessonId;
    this.startTime = Date.now();

    // 标记为学习中
    Storage.startLesson(lessonId);

    // 启动计时器
    this.startTimer();

    console.log('开始学习:', lessonId);
  },

  // 启动计时器
  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      if (this.currentLessonId && this.startTime) {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        // 每 30 秒保存一次
        if (elapsed % 30 === 0) {
          Storage.updateLessonProgress(this.currentLessonId, {
            timeSpentSeconds: elapsed
          });
        }
      }
    }, 1000);
  },

  // 停止学习
  stopLearning() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.currentLessonId && this.startTime) {
      const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
      Storage.updateLessonProgress(this.currentLessonId, {
        timeSpentSeconds: totalTime
      });
    }

    this.currentLessonId = null;
    this.startTime = null;
  },

  // 完成课程
  completeCurrentLesson() {
    if (this.currentLessonId) {
      const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
      Storage.completeLesson(this.currentLessonId, totalTime);
      this.stopLearning();
      console.log('课程完成:', this.currentLessonId);
    }
  },

  // 复习课程
  reviewLesson(lessonId) {
    Storage.reviewLesson(lessonId);
    this.startLearning(lessonId);
  },

  // 获取进度摘要
  getSummary() {
    const stats = Storage.getStats();

    return {
      completionRate: stats.completionRate + '%',
      completedLessons: stats.completed + stats.mastered,
      totalLessons: stats.totalLessons,
      totalTime: this.formatTime(stats.totalTimeSeconds),
      masteredLessons: stats.mastered,
      dueForReview: Storage.getLessonsDueForReview().length
    };
  },

  // 格式化时间
  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    return `${minutes}分钟`;
  },

  // 计算掌握度等级
  getMasteryLevel(level) {
    if (level >= 0.7) return { label: '精通', class: 'mastered', icon: '🟢' };
    if (level >= 0.4) return { label: '熟悉', class: 'completed', icon: '🟡' };
    return { label: '生疏', class: 'learning', icon: '🔴' };
  }
};

window.ProgressManager = ProgressManager;
