// 课程阅读器组件

const LessonViewer = {
  // 当前课程
  currentLesson: null,
  currentContent: null,
  currentQuizIndex: 0,

  // 打开课程
  async open(lessonId) {
    const lesson = Content.getLesson(lessonId);
    if (!lesson) {
      showToast('课程不存在');
      return;
    }

    this.currentLesson = lesson;
    this.currentQuizIndex = 0;
    const viewer = document.getElementById('lesson-viewer');
    const contentDiv = document.getElementById('lesson-content');

    // 显示加载状态
    viewer.classList.remove('hidden');
    contentDiv.innerHTML = `
      <div class="lesson-loading">
        <div class="loading-spinner"></div>
        <div>加载课程内容...</div>
      </div>
    `;

    // 更新标题
    document.getElementById('page-title').textContent = lesson.title;

    // 开始学习计时
    ProgressManager.startLearning(lessonId);

    // 加载课程内容
    const markdown = await Content.loadLessonContent(lesson);
    this.currentContent = markdown;

    // 渲染内容
    this.renderContent(markdown);

    // 更新导航按钮
    this.updateNavigation(lessonId);

    // 更新完成按钮状态
    this.updateCompleteButton(lessonId);

    // 绑定练习按钮
    this.bindQuizButton(lessonId);
  },

  // 绑定练习按钮
  bindQuizButton(lessonId) {
    const quizBtn = document.getElementById('quiz-btn');
    const quiz = QuizData.getQuiz(lessonId);

    if (quiz) {
      quizBtn.disabled = false;
      quizBtn.onclick = () => openQuiz(lessonId);
    } else {
      quizBtn.disabled = true;
      quizBtn.title = '暂无练习题';
    }
  },

  // 渲染 Markdown 内容
  renderContent(markdown) {
    const contentDiv = document.getElementById('lesson-content');

    // 使用 marked 解析 Markdown
    const html = marked.parse(markdown, {
      breaks: true,
      gfm: true
    });

    contentDiv.innerHTML = html;

    // 渲染 KaTeX 公式
    this.renderMathJax(contentDiv);

    // 处理图片路径
    this.fixImagePaths(contentDiv);
  },

  // 渲染数学公式
  renderMathJax(container) {
    // 查找所有行内公式 $...$ 和显示公式 $$...$$
    const textContent = container.innerHTML;

    // 处理显示公式 $$...$$
    const displayMathPattern = /\$\$([\s\S]*?)\$\$/g;
    const displayMatches = [...textContent.matchAll(displayMathPattern)];

    displayMatches.forEach(match => {
      const latex = match[1].trim();
      try {
        const rendered = katex.renderToString(latex, {
          displayMode: true,
          throwOnError: false
        });
        container.innerHTML = container.innerHTML.replace(match[0], rendered);
      } catch (e) {
        console.error('KaTeX 渲染失败:', e);
      }
    });

    // 处理行内公式 $...$ （排除已经渲染的）
    const inlineMathPattern = /\$([^$\n]+?)\$/g;
    const inlineMatches = [...container.innerHTML.matchAll(inlineMathPattern)];

    inlineMatches.forEach(match => {
      // 检查是否已经是渲染后的 HTML
      if (match[0].includes('<span') || match[0].includes('katex')) return;

      const latex = match[1].trim();
      try {
        const rendered = katex.renderToString(latex, {
          displayMode: false,
          throwOnError: false
        });
        container.innerHTML = container.innerHTML.replace(match[0], rendered);
      } catch (e) {
        console.error('KaTeX 渲染失败:', e);
      }
    });
  },

  // 修复图片路径
  fixImagePaths(container) {
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http') && !src.startsWith('/')) {
        // 假设图片在 content/{pack}/images/ 目录下
        img.src = `content/${Content.activePack}/images/${src}`;
      }
    });
  },

  // 更新导航按钮
  updateNavigation(lessonId) {
    const prevBtn = document.getElementById('prev-lesson');
    const nextBtn = document.getElementById('next-lesson');

    const prevLesson = Content.getPreviousLesson(lessonId);
    const nextLesson = Content.getNextLesson(lessonId);

    prevBtn.disabled = !prevLesson;
    nextBtn.disabled = !nextLesson;

    prevBtn.onclick = () => {
      if (prevLesson) this.open(prevLesson.id);
    };

    nextBtn.onclick = () => {
      if (nextLesson) this.open(nextLesson.id);
    };
  },

  // 更新完成按钮
  updateCompleteButton(lessonId) {
    const btn = document.getElementById('mark-complete');
    const progress = Storage.getLessonProgress(lessonId);

    if (progress?.status === 'completed' || progress?.status === 'mastered') {
      btn.textContent = '已完成 ✓';
      btn.classList.add('completed');
    } else {
      btn.textContent = '标记为完成';
      btn.classList.remove('completed');
    }

    btn.onclick = () => {
      ProgressManager.completeCurrentLesson();
      btn.textContent = '已完成 ✓';
      btn.classList.add('completed');
      showToast('课程已完成！');

      // 刷新知识树
      SkillTree.refresh();
    };
  },

  // 关闭阅读器
  close() {
    ProgressManager.stopLearning();

    const viewer = document.getElementById('lesson-viewer');
    viewer.classList.add('hidden');

    // 恢复标题
    document.getElementById('page-title').textContent = '知识框架';

    this.currentLesson = null;
  },

  // 刷新当前内容（例如切换语言后）
  refresh() {
    if (this.currentLesson) {
      this.open(this.currentLesson.id);
    }
  }
};

window.LessonViewer = LessonViewer;
