// 内容加载和管理

const Content = {
  // 当前激活的内容包
  activePack: 'maths-cs-ai',

  // 内容数据
  chapters: [],

  // 加载内容
  async load(pack = 'maths-cs-ai') {
    this.activePack = pack;

    try {
      const response = await fetch(`content/${pack}/chapters.json`);
      if (!response.ok) throw new Error('内容加载失败');

      const data = await response.json();
      this.chapters = data.chapters || [];

      // 保存到全局
      window.CONTENT_DATA = { pack, chapters: this.chapters };

      console.log('内容加载成功:', this.chapters.length, '章节');
      return this.chapters;
    } catch (error) {
      console.error('加载内容失败:', error);
      // 使用内置的默认内容
      this.chapters = this.getDefaultContent();
      window.CONTENT_DATA = { pack, chapters: this.chapters };
      return this.chapters;
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

  // 默认内容（当外部内容不可用时）
  getDefaultContent() {
    return [
      {
        id: 'ch01',
        title: '向量',
        order: 1,
        description: '向量空间、大小、方向、范数、度量',
        lessons: [
          {
            id: 'ch01-l01',
            title: '向量空间',
            order: 1,
            file: '01. vector spaces.md',
            estimatedMinutes: 15,
            prerequisites: []
          },
          {
            id: 'ch01-l02',
            title: '向量属性',
            order: 2,
            file: '02. vector properties.md',
            estimatedMinutes: 10,
            prerequisites: ['ch01-l01']
          },
          {
            id: 'ch01-l03',
            title: '范数与度量',
            order: 3,
            file: '03. norms and metrics.md',
            estimatedMinutes: 12,
            prerequisites: ['ch01-l01']
          },
          {
            id: 'ch01-l04',
            title: '向量积',
            order: 4,
            file: '04. products.md',
            estimatedMinutes: 15,
            prerequisites: ['ch01-l01']
          },
          {
            id: 'ch01-l05',
            title: '基与对偶',
            order: 5,
            file: '05. basis and duality.md',
            estimatedMinutes: 15,
            prerequisites: ['ch01-l02', 'ch01-l03']
          }
        ]
      },
      {
        id: 'ch02',
        title: '矩阵',
        order: 2,
        description: '矩阵属性、类型、运算、线性变换、分解',
        lessons: [
          {
            id: 'ch02-l01',
            title: '矩阵属性',
            order: 1,
            file: '01. matrix properties.md',
            estimatedMinutes: 15,
            prerequisites: ['ch01-l01']
          },
          {
            id: 'ch02-l02',
            title: '矩阵类型',
            order: 2,
            file: '02. matrix types.md',
            estimatedMinutes: 10,
            prerequisites: ['ch02-l01']
          }
        ]
      },
      {
        id: 'ch14',
        title: '数据结构与算法',
        order: 3,
        description: '基础、数组、链表、树、图、排序',
        lessons: [
          {
            id: 'ch14-l00',
            title: '基础：Big O、递归、回溯、动态规划',
            order: 0,
            file: '00. foundations.md',
            estimatedMinutes: 30,
            prerequisites: []
          },
          {
            id: 'ch14-l01',
            title: '数组与哈希表',
            order: 1,
            file: '01. arrays and hashing.md',
            estimatedMinutes: 20,
            prerequisites: ['ch14-l00']
          }
        ]
      }
    ];
  },

  // 获取所有依赖关系
  getAllDependencies() {
    const dependencies = [];

    for (const chapter of this.chapters) {
      for (const lesson of (chapter.lessons || [])) {
        if (lesson.prerequisites && lesson.prerequisites.length > 0) {
          for (const prereq of lesson.prerequisites) {
            dependencies.push({
              from: prereq,
              to: lesson.id
            });
          }
        }
      }
    }

    return dependencies;
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
      // 未来可以添加更多内容包
    ];
  }
};

// 导出到全局
window.Content = Content;
