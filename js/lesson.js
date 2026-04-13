// 课程阅读器组件

const LessonViewer = {
  // 当前课程
  currentLesson: null,
  currentContent: null,
  currentQuizIndex: 0,

  // 追踪之前访问的页面
  previousPage: null,

  // 打开课程
  async open(lessonId) {
    const lesson = Content.getLesson(lessonId);
    if (!lesson) {
      showToast('课程不存在');
      return;
    }

    this.currentLesson = lesson;
    this.currentQuizIndex = 0;

    // 记录当前页面，用于关闭时恢复
    this.previousPage = window.App?.currentPage || 'skill-tree';

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

    // 隐藏底部导航
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
      bottomNav.style.display = 'none';
    }

    // 绑定返回按钮（返回首页/知识树）
    const backBtn = document.getElementById('back-to-home');
    if (backBtn) {
      // 使用 dataset.bound 标志防止重复绑定
      if (!backBtn.dataset.bound) {
        backBtn.addEventListener('click', () => {
          this.close();
        });
        backBtn.dataset.bound = 'true';
      }
    }

    // 更新标题
    document.getElementById('page-title').textContent = lesson.title;

    // 开始学习计时
    ProgressManager.startLearning(lessonId);

    // 加载课程内容
    const markdown = await Content.loadLessonContent(lesson);
    this.currentContent = markdown;

    // 使用 ContentEnhancer 增强内容（添加猫和老鼠故事和比喻）
    const enhancedMarkdown = ContentEnhancer.enhanceLessonContent(markdown, lesson);

    // 渲染内容（使用双栏布局）
    this.renderContent(enhancedMarkdown);

    // 更新导航按钮（包括前课/后课按钮）
    this.updateNavigation(lessonId);

    // 更新完成按钮状态
    this.updateCompleteButton(lessonId);

    // 绑定练习按钮
    this.bindQuizButton(lessonId);

    // 绑定书签按钮
    this.bindBookmarkButton(lessonId);

    // 绑定费曼按钮
    this.bindFeynmanButton(lessonId);
  },

  // 绑定费曼按钮
  bindFeynmanButton(lessonId) {
    const feynmanBtn = document.getElementById('feynman-btn');
    if (!feynmanBtn) return;

    // 移除旧的监听器
    const newFeynmanBtn = feynmanBtn.cloneNode(true);
    feynmanBtn.parentNode.replaceChild(newFeynmanBtn, feynmanBtn);
    // 添加新的监听器
    newFeynmanBtn.addEventListener('click', () => {
      this.openFeynmanModal(lessonId);
    });
  },

  // 打开费曼模式弹窗
  openFeynmanModal(lessonId) {
    const modal = document.getElementById('feynman-modal');
    const textarea = document.getElementById('feynman-input');
    const saveBtn = document.getElementById('feynman-save');
    const closeBtn = document.getElementById('feynman-close');
    const historyList = document.getElementById('feynman-history-list');

    if (!modal || !textarea) return;

    // 加载历史记录
    const records = Storage.getLessonFeynmanRecords(lessonId);
    if (records.length > 0 && historyList) {
      historyList.innerHTML = records.map(record => `
        <div class="feynman-history-item">
          <div class="feynman-history-date">${new Date(record.createdAt).toLocaleString('zh-CN')}</div>
          <div class="feynman-history-text">${this.escapeHtml(record.explanation)}</div>
        </div>
      `).join('');
    } else if (historyList) {
      historyList.innerHTML = '<div style="color: var(--gray-500); font-size: 13px; text-align: center; padding: 20px;">还没有保存的解释</div>';
    }

    // 显示弹窗
    modal.classList.remove('hidden');
    textarea.focus();

    // 绑定保存按钮
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.replaceWith(newSaveBtn);
    document.getElementById('feynman-save')?.addEventListener('click', () => {
      const explanation = textarea.value.trim();
      if (explanation) {
        Storage.saveFeynmanRecord(lessonId, explanation);
        showToast('解释已保存');
        modal.classList.add('hidden');
        textarea.value = '';
        // 刷新历史记录
        this.openFeynmanModal(lessonId);
      } else {
        showToast('请输入解释内容');
      }
    });

    // 绑定关闭按钮
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.replaceWith(newCloseBtn);
    document.getElementById('feynman-close')?.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  },

  // HTML 转义
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // 绑定书签按钮
  bindBookmarkButton(lessonId) {
    const bookmarkBtn = document.getElementById('bookmark-btn');
    if (!bookmarkBtn) return;

    // 更新书签状态
    this.updateBookmarkButton(lessonId);

    // 移除旧的监听器
    const newBookmarkBtn = bookmarkBtn.cloneNode(true);
    bookmarkBtn.parentNode.replaceChild(newBookmarkBtn, bookmarkBtn);
    // 添加新的监听器
    newBookmarkBtn.addEventListener('click', () => {
      const isBookmarked = Storage.toggleBookmark(lessonId);
      this.updateBookmarkButton(lessonId);
      showToast(isBookmarked ? '已添加书签' : '已移除书签');
    });
  },

  // 更新书签按钮状态
  updateBookmarkButton(lessonId) {
    const bookmarkBtn = document.getElementById('bookmark-btn');
    if (!bookmarkBtn) return;

    const isBookmarked = Storage.isBookmarked(lessonId);
    bookmarkBtn.textContent = isBookmarked ? '⭐' : '☆';
    bookmarkBtn.style.opacity = isBookmarked ? '1' : '0.6';
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
    const currentLang = Storage.getLanguage();

    // 如果是中英双语模式，需要加载两个版本的内容
    if (currentLang === 'both') {
      this.renderBilingualContent(markdown, contentDiv);
    } else {
      // 根据语言选择内容版本
      const lang = currentLang === 'en-US' ? 'en' : 'zh';

      // 使用 marked 解析 Markdown
      const html = marked.parse(markdown, {
        breaks: true,
        gfm: true
      });

      // 创建双栏布局
      this.renderTwoColumnLayout(html, contentDiv);
    }
  },

  // 渲染双栏布局（文字左 + 图片右）
  renderTwoColumnLayout(html, container) {
    // 创建临时容器解析 HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // 提取所有图片
    const images = Array.from(tempDiv.querySelectorAll('img'));
    const hasImages = images.length > 0;

    if (hasImages) {
      // 创建双栏结构
      const leftColumn = document.createElement('div');
      leftColumn.className = 'lesson-text-column';
      leftColumn.innerHTML = tempDiv.innerHTML;

      const rightColumn = document.createElement('div');
      rightColumn.className = 'lesson-visual-column';

      // 将所有图片移到右栏
      images.forEach((img, index) => {
        const visualItem = document.createElement('div');
        visualItem.className = 'visual-item';
        visualItem.style.animationDelay = `${index * 0.1}s`;

        // 克隆图片（避免从原位置移除）
        const imgClone = img.cloneNode(true);

        // 创建标题
        const caption = document.createElement('div');
        caption.className = 'visual-caption';
        caption.textContent = img.alt || `示意图 ${index + 1}`;

        visualItem.appendChild(imgClone);
        visualItem.appendChild(caption);
        rightColumn.appendChild(visualItem);
      });

      // 清空左栏中的图片（只保留文字）
      const leftImages = leftColumn.querySelectorAll('img');
      leftImages.forEach(img => img.remove());

      // 组合双栏
      container.innerHTML = '';
      const twoColumn = document.createElement('div');
      twoColumn.className = 'lesson-two-column';
      twoColumn.appendChild(leftColumn);
      twoColumn.appendChild(rightColumn);
      container.appendChild(twoColumn);
    } else {
      // 没有图片，使用单栏布局
      container.innerHTML = html;
    }

    // 渲染 KaTeX 公式
    this.renderMathJax(container);

    // 处理图片路径（确保使用正确的路径）
    this.fixImagePaths(container);
  },

  // 渲染双语内容
  renderBilingualContent(originalMarkdown, container) {
    // 使用 marked 解析 Markdown
    const html = marked.parse(originalMarkdown, {
      breaks: true,
      gfm: true
    });

    container.innerHTML = html;

    // 渲染 KaTeX 公式
    this.renderMathJax(container);

    // 处理图片路径
    this.fixImagePaths(container);

    // 添加双语标识（未来扩展用）
    const bilingualHint = document.createElement('div');
    bilingualHint.className = 'bilingual-hint';
    bilingualHint.style.cssText = 'padding: 12px; background: #fff3cd; border-radius: 8px; margin-bottom: 16px; font-size: 14px;';
    bilingualHint.innerHTML = '💡 提示：当前为中英双语模式。如需查看纯中文或纯英文版本，请在设置中切换。';
    container.insertBefore(bilingualHint, container.firstChild);
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
    const lessonProgress = document.getElementById('lesson-progress');

    const prevLesson = Content.getPreviousLesson(lessonId);
    const nextLesson = Content.getNextLesson(lessonId);

    // 获取当前章节的课程列表
    const chapter = Content.getChapterByLesson(lessonId);
    const lessonsInChapter = chapter ? chapter.lessons : [];
    const currentIndex = lessonsInChapter.findIndex(l => l.id === lessonId);

    // 更新桌面端按钮
    if (prevBtn && nextBtn) {
      prevBtn.disabled = !prevLesson;
      nextBtn.disabled = !nextLesson;

      // 移除旧监听器并添加新的
      const newPrevBtn = prevBtn.cloneNode(true);
      prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
      newPrevBtn.addEventListener('click', () => {
        if (prevLesson) this.open(prevLesson.id);
      });

      const newNextBtn = nextBtn.cloneNode(true);
      nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
      newNextBtn.addEventListener('click', () => {
        if (nextLesson) this.open(nextLesson.id);
      });
    }

    // 更新课程进度显示
    if (lessonProgress && lessonsInChapter.length > 0) {
      lessonProgress.textContent = `${currentIndex + 1} / ${lessonsInChapter.length}`;
    }
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

    // 移除旧监听器并添加新的
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', () => {
      ProgressManager.completeCurrentLesson();
      newBtn.textContent = '已完成 ✓';
      newBtn.classList.add('completed');

      // 触发庆祝效果
      CelebrationEffect.createConfetti();
      showToast('课程已完成！🎉');

      // 刷新知识树
      SkillTree.refresh();
    });
  },

  // 关闭阅读器
  close() {
    ProgressManager.stopLearning();

    const viewer = document.getElementById('lesson-viewer');
    viewer.classList.add('hidden');

    // 恢复标题
    document.getElementById('page-title').textContent = '知识框架';

    // 恢复底部导航
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
      bottomNav.style.display = 'flex';
    }

    // 恢复到之前访问的页面（依赖图、知识树等）
    const pageToRestore = this.previousPage || 'skill-tree';
    if (window.App && pageToRestore !== 'skill-tree') {
      // 如果是从依赖图等其他页面进入的，恢复该页面
      window.App.currentPage = pageToRestore;

      // 更新底部导航激活状态
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageToRestore);
      });

      // 更新页面标题
      const titles = {
        'dashboard': '学习概览',
        'skill-tree': '知识框架',
        'dependency': '依赖关系',
        'progress': '学习进度'
      };
      document.getElementById('page-title').textContent = titles[pageToRestore] || '知识框架';

      // 重新渲染页面内容
      const app = document.getElementById('app');
      app.innerHTML = '';
      switch (pageToRestore) {
        case 'dependency':
          DependencyGraph.render(app);
          break;
        case 'progress':
          window.App.renderProgress(app);
          break;
        case 'dashboard':
          window.App.renderDashboard(app);
          break;
      }
    }

    this.currentLesson = null;
    this.previousPage = null;
  },

  // 刷新当前内容（例如切换语言后）
  refresh() {
    if (this.currentLesson) {
      this.open(this.currentLesson.id);
    }
  }
};

window.LessonViewer = LessonViewer;
