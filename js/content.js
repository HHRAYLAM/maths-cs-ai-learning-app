// 内容加载和管理

const Content = {
  // 当前激活的内容包
  activePack: 'math-cs-ai',

  // 内容数据
  chapters: [],

  // 加载内容
  async load(pack = 'math-cs-ai') {
    this.activePack = pack;

    try {
      const response = await fetch(`content/${pack}/chapters.json?t=${Date.now()}`);
      if (!response.ok) throw new Error('内容加载失败');

      const data = await response.json();
      this.chapters = data.chapters || [];

      // 保存到全局
      window.CONTENT_DATA = { pack, chapters: this.chapters };

      console.log('内容加载成功:', this.chapters.length, '章节');
      return this.chapters;
    } catch (error) {
      console.error('加载内容失败:', error);
      throw error;
    }
  },

  // 获取所有章节
  getChapters() {
    return this.chapters;
  },

  // 获取单个章节
  getChapter(chapterId) {
    return this.chapters.find(ch => ch.id === chapterId);
  },

  // 获取单个课程
  getLesson(lessonId) {
    for (const chapter of this.chapters) {
      const lesson = chapter.lessons?.find(l => l.id === lessonId);
      if (lesson) return { ...lesson, chapterId: chapter.id };
    }
    return null;
  },

  // 获取课程索引
  getLessonIndex(lessonId) {
    let index = 0;
    for (const chapter of this.chapters) {
      for (let i = 0; i < (chapter.lessons?.length || 0); i++) {
        if (chapter.lessons[i].id === lessonId) {
          return { chapterIndex: index, lessonIndex: i, globalIndex: index };
        }
        index++;
      }
    }
    return null;
  },

  // 获取上一课
  getPreviousLesson(lessonId) {
    const location = this.getLessonIndex(lessonId);
    if (!location) return null;

    const { chapterIndex, lessonIndex } = location;
    const chapter = this.chapters[chapterIndex];

    // 同章节内的前一课
    if (lessonIndex > 0) {
      return chapter.lessons[lessonIndex - 1];
    }

    // 前一章节的最后一课
    if (chapterIndex > 0) {
      const prevChapter = this.chapters[chapterIndex - 1];
      const lessons = prevChapter.lessons || [];
      return lessons[lessons.length - 1] || null;
    }

    return null;
  },

  // 获取下一课
  getNextLesson(lessonId) {
    const location = this.getLessonIndex(lessonId);
    if (!location) return null;

    const { chapterIndex, lessonIndex } = location;
    const chapter = this.chapters[chapterIndex];

    // 同章节内的下一课
    if (lessonIndex < (chapter.lessons?.length || 0) - 1) {
      return chapter.lessons[lessonIndex + 1];
    }

    // 下一章节的第一课
    if (chapterIndex < this.chapters.length - 1) {
      const nextChapter = this.chapters[chapterIndex + 1];
      const lessons = nextChapter.lessons || [];
      return lessons[0] || null;
    }

    return null;
  },

  // 加载课程内容（Markdown）
  async loadLessonContent(lesson) {
    if (!lesson || !lesson.file) return null;

    try {
      const response = await fetch(`content/${this.activePack}/${lesson.file}`);
      if (!response.ok) throw new Error('课程 content 加载失败');

      const markdown = await response.text();
      return markdown;
    } catch (error) {
      console.error('加载课程内容失败:', error);
      return `# ${lesson.title}\n\n内容加载失败，请稍后重试。`;
    }
  },

  // 获取课程元数据（不含 content）
  getLessonMeta(lessonId) {
    return this.getLesson(lessonId);
  },

  // 获取章节进度
  getChapterProgress(chapter) {
    const lessons = chapter.lessons || [];
    if (lessons.length === 0) return 0;

    const completed = lessons.filter(lesson => {
      const progress = Storage.getLessonProgress(lesson.id);
      return progress && (progress.status === 'completed' || progress.status === 'mastered');
    }).length;

    return Math.round((completed / lessons.length) * 100);
  },

  // 检查先修条件
  checkPrerequisites(lesson) {
    const prerequisites = lesson.prerequisites || [];
    if (prerequisites.length === 0) return { canAccess: true, missing: [] };

    const missing = [];
    for (const prereqId of prerequisites) {
      const progress = Storage.getLessonProgress(prereqId);
      if (!progress || progress.status !== 'completed') {
        const prereqLesson = this.getLesson(prereqId);
        missing.push(prereqLesson?.title || prereqId);
      }
    }

    return {
      canAccess: missing.length === 0,
      missing
    };
  },

  // 内容包列表
  getPacks() {
    return [
      {
        id: 'maths-cs-ai',
        name: '数学/CS/AI',
        description: '数学、计算机科学、人工智能完整路线',
        chapters: 20
      }
    ];
  }
};

// 导出到全局
window.Content = Content;
