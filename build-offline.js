// 离线 HTML 打包生成器 - Node.js 脚本
// 使用方法：node build-offline.js

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, 'dist');
const OUTPUT_FILE = path.join(BUILD_DIR, 'index-offline.html');

// 创建输出目录
if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

// 读取并内嵌 CSS
function readCSS(file) {
  return fs.readFileSync(path.join(__dirname, 'css', file), 'utf-8');
}

// 读取并内嵌 JS
function readJS(file) {
  return fs.readFileSync(path.join(__dirname, 'js', file), 'utf-8');
}

// 读取内容数据
function readContent() {
  const chaptersRaw = fs.readFileSync(
    path.join(__dirname, 'content', 'math-cs-ai', 'chapters.json'),
    'utf-8'
  );
  return JSON.parse(chaptersRaw);
}

// 收集所有章节的 Markdown 内容
function collectLessonContents(chapters) {
  const contents = {};
  for (const chapter of chapters.chapters) {
    for (const lesson of chapter.lessons) {
      if (lesson.file) {
        const filePath = path.join(__dirname, 'content', 'math-cs-ai', lesson.file);
        if (fs.existsSync(filePath)) {
          contents[lesson.file] = fs.readFileSync(filePath, 'utf-8');
        }
      }
    }
  }
  return contents;
}

// 构建 HTML
function buildHTML() {
  const mainCSS = readCSS('main.css');
  const skillTreeCSS = readCSS('skill-tree.css');
  const lessonCSS = readCSS('lesson.css');
  const dependencyCSS = readCSS('dependency.css');

  const storageJS = readJS('storage.js');
  const progressJS = readJS('progress.js');
  const quizJS = readJS('quiz.js');
  const skillTreeJS = readJS('skill-tree.js');
  const dependencyJS = readJS('dependency.js');
  const lessonJS = readJS('lesson.js');
  const appJS = readJS('app.js');

  const contentData = readContent();
  const lessonContents = collectLessonContents(contentData);

  // 修改 Content.load 方法
  const contentDataStr = JSON.stringify(contentData.chapters);
  const contentJSModified = `
const Content = {
  chapters: ${contentDataStr},
  activePack: 'math-cs-ai',

  getChapters() {
    return this.chapters;
  },

  getChapter(chapterId) {
    return this.chapters.find(c => c.id === chapterId) || null;
  },

  getLesson(lessonId) {
    for (const chapter of this.chapters) {
      const lesson = (chapter.lessons || []).find(l => l.id === lessonId);
      if (lesson) return lesson;
    }
    return null;
  },

  getChapterByLesson(lessonId) {
    for (const chapter of this.chapters) {
      if ((chapter.lessons || []).some(l => l.id === lessonId)) {
        return chapter;
      }
    }
    return null;
  },

  getLessonsForChapter(chapterId) {
    const chapter = this.getChapter(chapterId);
    return chapter ? (chapter.lessons || []) : [];
  },

  getAllLessons() {
    const lessons = [];
    for (const chapter of this.chapters) {
      if (chapter.lessons) {
        lessons.push(...chapter.lessons.map(l => ({ ...l, chapterId: chapter.id })));
      }
    }
    return lessons;
  },

  getAllDependencies() {
    const dependencies = [];
    for (const chapter of this.chapters) {
      for (const lesson of (chapter.lessons || [])) {
        for (const prereqId of (lesson.prerequisites || [])) {
          dependencies.push({
            from: prereqId,
            to: lesson.id,
            fromChapter: this.getChapterByLesson(prereqId)?.id,
            toChapter: chapter.id
          });
        }
      }
    }
    return dependencies;
  },

  async loadLessonContent(lesson) {
    if (!lesson || !lesson.file) return null;

    // 离线模式：从内嵌数据读取
    const fileName = lesson.file.trim();
    if (window.LESSON_CONTENTS && window.LESSON_CONTENTS[fileName]) {
      console.log('加载课程内容成功:', fileName);
      return window.LESSON_CONTENTS[fileName];
    }

    // 尝试移除前后的空格和点号
    const normalized = fileName.replace(/^\\s+|\\.\\s+$/g, '');
    for (const [key, value] of Object.entries(window.LESSON_CONTENTS || {})) {
      if (key.replace(/^\\s+|\\.\\s+$/g, '') === normalized) {
        console.log('加载课程内容成功 (模糊匹配):', key);
        return value;
      }
    }

    console.error('课程内容未找到:', fileName, '可用内容:', Object.keys(window.LESSON_CONTENTS || {}).length);
    return null;
  },

  getLessonMeta(lessonId) {
    return this.getLesson(lessonId);
  },

  getChapterProgress(chapter) {
    const lessons = chapter.lessons || [];
    if (lessons.length === 0) return 0;
    const completed = lessons.filter(lesson => {
      const progress = Storage.getLessonProgress(lesson.id);
      return progress && (progress.status === 'completed' || progress.status === 'mastered');
    }).length;
    return Math.round((completed / lessons.length) * 100);
  },

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

  search(query) {
    const results = [];
    const q = query.toLowerCase().trim();
    if (!q) return results;
    for (const chapter of this.chapters) {
      if (chapter.title.toLowerCase().includes(q)) {
        results.push({ type: 'chapter', data: chapter });
      }
      for (const lesson of (chapter.lessons || [])) {
        if (lesson.title.toLowerCase().includes(q)) {
          results.push({ type: 'lesson', data: lesson, chapter });
        }
      }
    }
    return results;
  },

  async load() {
    window.CONTENT_DATA = { pack: this.activePack, chapters: this.chapters };
    console.log('内容加载成功 (离线版):', this.chapters.length, '章节');
    return this.chapters;
  }
};
`;

  // 简化的 app.js
  const appJSSimple = `
const App = {
  currentPage: 'skill-tree',

  async init() {
    console.log('应用初始化...');
    await Content.load();
    const currentTheme = Storage.getTheme();
    Storage.applyTheme(currentTheme);
    this.bindNavigation();
    this.bindModals();
    this.navigateTo('skill-tree');
    console.log('应用初始化完成');
  },

  bindNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        if (page) this.navigateTo(page);
      });
    });
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      if (hash && ['dashboard', 'skill-tree', 'dependency', 'progress'].includes(hash)) {
        this.navigateTo(hash);
      }
    });
  },

  bindModals() {
    document.getElementById('language-btn')?.addEventListener('click', () => {
      document.getElementById('settings-modal')?.classList.remove('hidden');
    });
    document.getElementById('search-btn')?.addEventListener('click', () => {
      document.getElementById('search-modal')?.classList.remove('hidden');
    });
    document.getElementById('settings-btn')?.addEventListener('click', () => {
      document.getElementById('settings-modal')?.classList.remove('hidden');
    });
    document.getElementById('search-close')?.addEventListener('click', () => {
      document.getElementById('search-modal')?.classList.add('hidden');
    });
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', function() {
        this.closest('.modal')?.classList.add('hidden');
      });
    });
    document.getElementById('search-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
          const results = Content.search(query);
          renderSearchResults(results);
        }
      }
    });
    document.getElementById('reset-progress')?.addEventListener('click', () => {
      if (confirm('确定要重置所有学习进度吗？此操作不可恢复！')) {
        localStorage.removeItem('learning-progress');
        localStorage.removeItem('bookmarks');
        localStorage.removeItem('feynman-explanations');
        localStorage.removeItem('wrong-answers');
        window.dispatchEvent(new Event('progress-reset'));
        document.getElementById('settings-modal')?.classList.add('hidden');
      }
    });
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const theme = this.dataset.theme;
        Storage.setTheme(theme);
        Storage.applyTheme(theme);
        window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
      });
    });
    document.querySelectorAll('.language-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.language-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        Storage.setLanguage(this.dataset.lang);
      });
    });
    this.bindSearch();
  },

  bindSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length > 0) {
        const results = Content.search(query);
        renderSearchResults(results);
      } else {
        document.getElementById('search-results').innerHTML = '';
      }
    });
  },

  navigateTo(page) {
    this.currentPage = page;
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });
    const titles = {
      'dashboard': '学习概览',
      'skill-tree': '知识框架',
      'dependency': '依赖关系',
      'progress': '学习进度'
    };
    document.getElementById('page-title').textContent = titles[page] || '知识框架';
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
    window.location.hash = page;
  },

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

  renderDashboard(container) {
    const summary = ProgressManager.getSummary();
    const stats = Storage.getStats();
    container.innerHTML = \`
      <div class="dashboard-container">
        <div class="dashboard-section">
          <h2 class="dashboard-section-title">学习统计</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">\${stats.completedLessons}</div>
              <div class="stat-label">已完成课程</div>
            </div>
            <div class="stat-card green">
              <div class="stat-value">\${Object.keys(Storage.getProgress()).length}</div>
              <div class="stat-label">学习进度</div>
            </div>
          </div>
        </div>
      </div>
    \`;
  },

  renderProgress(container) {
    const chapters = Content.getChapters();
    let html = '<div class="skill-tree-container">';
    for (const chapter of chapters) {
      const progress = Content.getChapterProgress(chapter);
      html += \`
        <div class="chapter-card">
          <div class="chapter-info">
            <div class="chapter-title">\${chapter.order}. \${chapter.title}</div>
            <div class="chapter-description">\${chapter.description}</div>
          </div>
          <div class="chapter-progress">
            <div class="progress-percent">\${progress}%</div>
            <div class="chapter-progress-bar">
              <div class="chapter-progress-fill" style="width: \${progress}%"></div>
            </div>
          </div>
        </div>
      \`;
    }
    html += '</div>';
    container.innerHTML = html;
  },

  continueLearning() {
    const currentLesson = Storage.getCurrentLesson();
    if (currentLesson) {
      SkillTree.openLesson(currentLesson);
    }
  },

  startFirstLesson() {
    const firstChapter = Content.getChapters()[0];
    if (firstChapter && firstChapter.lessons && firstChapter.lessons[0]) {
      SkillTree.openLesson(firstChapter.lessons[0].id);
    }
  }
};

function renderSearchResults(results) {
  const container = document.getElementById('search-results');
  if (!results || results.length === 0) {
    container.innerHTML = '<div class="search-empty"><div class="search-empty-icon">🔍</div><div class="search-empty-title">未找到匹配的课程</div></div>';
    return;
  }
  container.innerHTML = results.map(r => {
    if (r.type === 'lesson') {
      return \`<div class="search-result-item" onclick="SkillTree.openLesson('\${r.data.id}')">
        <div class="search-result-title">\${r.data.title}</div>
        <div class="search-result-chapter">\${r.chapter.title}</div>
      </div>\`;
    }
    return \`<div class="search-result-item"><div class="search-result-title">\${r.data.title}</div></div>\`;
  }).join('');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2000);
  }
}

function closeModal(modalId) {
  document.getElementById(modalId)?.classList.add('hidden');
}

function closeQuiz() {
  document.getElementById('quiz-modal')?.classList.add('hidden');
}

window.App = App;
window.showToast = showToast;
window.closeModal = closeModal;
window.closeQuiz = closeQuiz;
window.renderSearchResults = renderSearchResults;

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
`;

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="theme-color" content="#4A90D9">
  <meta name="description" content="数学、计算机、AI 知识学习应用 - 离线版">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <title>数学/计算机/AI 学习 - 离线版</title>
  <style>
    ${mainCSS}
    ${skillTreeCSS}
    ${lessonCSS}
    ${dependencyCSS}
  </style>
  <!-- KaTeX 公式渲染 -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <!-- Marked Markdown 解析 -->
  <script src="https://cdn.jsdelivr.net/npm/marked@11.1.1/lib/marked.umd.js"></script>
</head>
<body>
  <!-- 顶部导航栏 -->
  <header class="top-nav">
    <h1 id="page-title">知识框架</h1>
    <div class="header-actions">
      <button id="search-btn" class="icon-btn" title="搜索">🔍</button>
      <button id="language-btn" class="icon-btn" title="切换语言">🌐</button>
      <button id="settings-btn" class="icon-btn" title="设置">⚙️</button>
    </div>
  </header>

  <!-- 主内容区 -->
  <main id="app" class="main-content">
    <!-- 动态渲染内容 -->
  </main>

  <!-- 底部导航栏 -->
  <nav class="bottom-nav">
    <a href="#dashboard" class="nav-item" data-page="dashboard">
      <span class="icon">📊</span>
      <span class="label">概览</span>
    </a>
    <a href="#skill-tree" class="nav-item active" data-page="skill-tree">
      <span class="icon">🌳</span>
      <span class="label">知识树</span>
    </a>
    <a href="#dependency" class="nav-item" data-page="dependency">
      <span class="icon">🔗</span>
      <span class="label">依赖图</span>
    </a>
    <a href="#progress" class="nav-item" data-page="progress">
      <span class="icon">📈</span>
      <span class="label">进度</span>
    </a>
  </nav>

  <!-- 课程阅读页面 -->
  <div id="lesson-viewer" class="lesson-viewer hidden">
    <div class="lesson-header">
      <button id="back-to-tree" class="back-btn">← 返回</button>
      <div class="lesson-nav">
        <button id="prev-lesson" class="nav-btn" disabled>◀</button>
        <button id="bookmark-btn" class="nav-btn" title="添加书签">⭐</button>
        <button id="feynman-btn" class="nav-btn" title="费曼模式">🎓</button>
        <button id="quiz-btn" class="nav-btn" title="练习题">📝</button>
        <button id="next-lesson" class="nav-btn">▶</button>
      </div>
    </div>
    <div class="lesson-content" id="lesson-content">
      <!-- Markdown 内容渲染于此 -->
    </div>
    <div class="lesson-footer">
      <button id="mark-complete" class="complete-btn">标记为完成</button>
    </div>
  </div>

  <!-- 费曼模式弹窗 -->
  <div id="feynman-modal" class="modal hidden">
    <div class="modal-content feynman-modal-content">
      <h2>🎓 费曼学习法</h2>
      <div class="feynman-intro">
        <p>请用简单的语言解释这个概念，就像教给一个完全不懂的人：</p>
      </div>
      <textarea id="feynman-input" class="feynman-input" placeholder="1. 这个概念是什么？&#10;2. 它如何工作？&#10;3. 能举一个例子吗？"></textarea>
      <div class="feynman-actions">
        <button id="feynman-save" class="btn btn-primary">保存解释</button>
        <button id="feynman-close" class="btn btn-secondary">关闭</button>
      </div>
      <div id="feynman-history" class="feynman-history">
        <h3>我的解释历史</h3>
        <div id="feynman-history-list"></div>
      </div>
    </div>
  </div>

  <!-- 练习模式弹窗 -->
  <div id="quiz-modal" class="modal hidden">
    <div class="modal-content quiz-modal-content">
      <h2 id="quiz-title">练习题</h2>
      <div id="quiz-container">
        <!-- 动态生成练习题 -->
      </div>
      <button class="modal-close" onclick="closeQuiz()">关闭</button>
    </div>
  </div>

  <!-- 搜索弹窗 -->
  <div id="search-modal" class="modal hidden">
    <div class="modal-content search-modal-content">
      <h2>搜索课程</h2>
      <div class="search-box">
        <input type="text" id="search-input" class="search-input" placeholder="搜索课程标题、概念、关键词...">
        <button id="search-close" class="search-close">✕</button>
      </div>
      <div id="search-results" class="search-results">
        <!-- 动态生成搜索结果 -->
      </div>
    </div>
  </div>

  <!-- 设置弹窗 -->
  <div id="settings-modal" class="modal hidden">
    <div class="modal-content">
      <h2>设置</h2>
      <div class="settings-section">
        <h3>主题外观</h3>
        <div class="theme-selector">
          <button class="theme-btn active" data-theme="light">☀️ 浅色</button>
          <button class="theme-btn" data-theme="dark">🌙 暗色</button>
          <button class="theme-btn" data-theme="auto">🔄 跟随系统</button>
        </div>
      </div>
      <div class="settings-section">
        <h3>学习进度</h3>
        <button id="reset-progress" class="setting-btn danger">重置所有进度</button>
      </div>
      <div class="settings-section">
        <h3>关于</h3>
        <p>基于 <a href="https://github.com/HenryNdubuaku/maths-cs-ai-compendium" target="_blank">数学/CS/AI 知识大全</a> 构建</p>
        <p>版本：1.0.0 (离线版)</p>
        <p>💡 提示：此版本为完全离线版本，所有内容已内嵌到 HTML 文件中</p>
      </div>
      <button class="modal-close" onclick="closeModal('settings-modal')">关闭</button>
    </div>
  </div>

  <!-- Toast 提示 -->
  <div id="toast" class="toast hidden"></div>

  <!-- 脚本 - 内嵌数据 -->
  <script>
    window.LESSON_CONTENTS = ${JSON.stringify(lessonContents)};
  </script>

  <!-- 脚本 - 核心逻辑 -->
  <script>
    ${storageJS}
    ${contentJSModified}
    ${progressJS}
    ${quizJS}
    ${skillTreeJS}
    ${dependencyJS}
    ${lessonJS}
    ${appJSSimple}
  </script>
</body>
</html>`;

  return html;
}

// 主函数
function main() {
  console.log('开始构建离线 HTML...');

  try {
    const html = buildHTML();
    fs.writeFileSync(OUTPUT_FILE, html, 'utf-8');

    const stats = fs.statSync(OUTPUT_FILE);
    const sizeKB = (stats.size / 1024).toFixed(2);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

    console.log('✓ 构建完成!');
    console.log(`  输出文件：${OUTPUT_FILE}`);
    console.log(`  文件大小：${sizeKB} KB (${sizeMB} MB)`);
    console.log('');
    console.log('使用方法:');
    console.log('  1. 将生成的 index-offline.html 复制到手机/电脑');
    console.log('  2. 用浏览器打开即可离线学习');
    console.log('  3. 学习进度会保存在浏览器 LocalStorage 中');
  } catch (error) {
    console.error('构建失败:', error);
    process.exit(1);
  }
}

main();
