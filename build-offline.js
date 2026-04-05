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

// 转义字符串用于嵌入 JSON
function escapeForJSON(str) {
  return JSON.stringify(str);
}

// 构建 HTML
function buildHTML() {
  const mainCSS = readCSS('main.css');
  const skillTreeCSS = readCSS('skill-tree.css');
  const lessonCSS = readCSS('lesson.css');
  const dependencyCSS = readCSS('dependency.css');

  const storageJS = readJS('storage.js');
  const contentJS = readJS('content.js');
  const progressJS = readJS('progress.js');
  const quizJS = readJS('quiz.js');
  const skillTreeJS = readJS('skill-tree.js');
  const dependencyJS = readJS('dependency.js');
  const lessonJS = readJS('lesson.js');
  const appJS = readJS('app.js');
  const pwaManagerJS = readJS('pwa-manager.js');

  const contentData = readContent();
  const lessonContents = collectLessonContents(contentData);

  // 修改 Content.loadLessonContent 以支持离线模式
  const modifiedLessonJS = lessonJS.replace(
    'async loadLessonContent(lesson) {',
    `async loadLessonContent(lesson) {
    // 离线模式：从内嵌数据读取
    if (lesson.file && window.LESSON_CONTENTS && window.LESSON_CONTENTS[lesson.file]) {
      return window.LESSON_CONTENTS[lesson.file];
    }
    if (!lesson || !lesson.file) return null;`
  );

  // 修改 Content.load 方法，直接使用内嵌数据
  const embeddedContentJS = contentJS.replace(
    'async load(pack = \'math-cs-ai\') {',
    `async load(pack = 'math-cs-ai') {
    this.activePack = pack;
    // 离线模式：使用内嵌数据
    this.chapters = ${JSON.stringify(contentData.chapters)};
    window.CONTENT_DATA = { pack, chapters: this.chapters };
    console.log('内容加载成功 (离线模式):', this.chapters.length, '章节');
    return this.chapters;
  },

  // 原始方法（保留作为fallback）
  _loadOriginal: async function(pack = 'math-cs-ai') {
    this.activePack = pack;`
  ).replace(
    'try {\n      const response = await fetch',
    'try {\n      const response = await fetch'
  );

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
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"><\/script>
  <!-- Marked Markdown 解析 -->
  <script src="https://cdn.jsdelivr.net/npm/marked@11.1.1/lib/marked.umd.js"><\/script>
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

  <!-- 内容包选择弹窗 -->
  <div id="content-pack-modal" class="modal hidden">
    <div class="modal-content">
      <h2>选择学习内容</h2>
      <div id="content-pack-list" class="pack-list">
        <!-- 动态生成 -->
      </div>
      <button class="modal-close" onclick="closeModal('content-pack-modal')">关闭</button>
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
      <div id="search-hints" class="search-hints">
        <div class="hint-item">💡 支持搜索课程标题、概念名称</div>
        <div class="hint-item">💡 按 Enter 键快速搜索</div>
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
        <h3>语言设置</h3>
        <div class="language-selector">
          <button class="language-btn active" data-lang="zh-CN">中文</button>
          <button class="language-btn" data-lang="en-US">English</button>
          <button class="language-btn" data-lang="both">中英双语</button>
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

  <!-- 脚本 -->
  <script>
    // 内嵌的课程内容 (Markdown)
    window.LESSON_CONTENTS = ${JSON.stringify(lessonContents)};

    // 内嵌的章节数据
    window.EMBEDDED_CONTENT = ${JSON.stringify(contentData)};
  <\/script>
  <script>
    ${storageJS}
    ${embeddedContentJS}
    ${progressJS}
    ${quizJS}
    ${skillTreeJS}
    ${dependencyJS}
    ${modifiedLessonJS}
    ${appJS}

    // 全局辅助函数
    function closeModal(modalId) {
      document.getElementById(modalId)?.classList.add('hidden');
    }

    function closeQuiz() {
      document.getElementById('quiz-modal')?.classList.add('hidden');
    }

    function showToast(message) {
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2000);
      }
    }

    // 页面加载完成后初始化
    window.addEventListener('DOMContentLoaded', () => {
      App.init();
    });
  <\/script>
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
