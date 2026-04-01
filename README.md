# Maths CS AI 学习应用

一个类似 Duolingo 的移动端优先学习应用，用于学习数学、计算机科学和人工智能知识。

## 🚀 快速开始

### 方法 1：直接在浏览器打开

1. 双击 `index.html` 文件即可在浏览器中打开
2. 或使用本地服务器：
   ```bash
   # 如果有 Python
   python -m http.server 8000

   # 如果有 Node.js
   npx serve
   ```
3. 访问 `http://localhost:8000`

### 方法 2：部署到 GitHub Pages（推荐）

1. 将本项目推送到 GitHub 仓库
2. 进入仓库 Settings → Pages
3. Source 选择 `main branch`，保存
4. 访问 `https://你的用户名.github.io/仓库名/`

### 方法 3：安装到手机

**Android (Chrome):**
1. 用 Chrome 打开应用网址
2. 点击右上角菜单 (⋮)
3. 选择"安装应用"或"添加到主屏幕"
4. 确认后应用会出现在桌面

**iOS (Safari):**
1. 用 Safari 打开应用网址
2. 点击底部分享按钮
3. 选择"添加到主屏幕"
4. 确认后应用会出现在桌面

## 📁 项目结构

```
math-cs-ai-learning-app/
├── index.html              # 主页面
├── manifest.json           # PWA 配置
├── service-worker.js       # 离线缓存
├── css/
│   ├── main.css           # 主样式
│   ├── skill-tree.css     # 知识树样式
│   └── lesson.css         # 课程页样式
├── js/
│   ├── app.js             # 主应用逻辑
│   ├── storage.js         # 本地存储
│   ├── content.js         # 内容管理
│   ├── progress.js        # 进度追踪
│   ├── skill-tree.js      # 知识树组件
│   ├── dependency.js      # 依赖图组件
│   ├── lesson.js          # 课程阅读器
│   └── service-worker-register.js
├── content/
│   └── maths-cs-ai/
│       ├── chapters.json  # 章节元数据
│       ├── images/        # 课程图片
│       └── *.md           # 课程内容
└── images/
    ├── icon-192.png       # APP 图标
    └── icon-512.png
```

## 📖 功能特性

### 知识框架
- 🌳 **思维导图式知识树** - 可折叠/展开的章节和课程
- 🔗 **依赖关系图** - 显示知识点之间的先修关系
- 📊 **进度追踪** - 百分比、学习时长、掌握度

### 学习功能
- 📱 **移动端优化** - 完美的手机端体验
- 💾 **离线使用** - Service Worker 缓存支持
- ⏱️ **学习计时** - 自动追踪学习时长
- ✅ **完成标记** - 标记课程完成状态
- 🔄 **复习提醒** - 基于间隔重复的复习系统

### 进度统计
- 完成率百分比
- 已掌握课程数
- 总学习时长
- 待复习课程

## 🎯 使用指南

### 开始学习
1. 打开应用，默认显示"知识框架"页面
2. 点击任意章节可展开/收起
3. 点击课程进入学习
4. 学完后点击"标记为完成"

### 查看依赖关系
1. 点击底部导航"依赖图"
2. 查看知识点之间的先修关系
3. 点击节点进入课程

### 追踪进度
1. 点击底部导航"进度"
2. 查看总体完成率和各章节进度
3. 查看掌握度分布和学习时长

## 🔧 添加新内容

### 添加章节

编辑 `content/mathcs-cs-ai/chapters.json`：

```json
{
  "id": "ch06",
  "title": "机器学习",
  "order": 7,
  "description": "监督学习、无监督学习、深度学习",
  "lessons": [
    {
      "id": "ch06-l01",
      "title": "机器学习基础",
      "order": 1,
      "file": "01. introduction.md",
      "estimatedMinutes": 20,
      "prerequisites": []
    }
  ]
}
```

### 添加课程内容

在 `content/mathcs-cs-ai/` 目录下创建 Markdown 文件：

```markdown
# 课程标题

*简介：一句话描述课程内容*

## 第一部分

内容...

## 第二部分

内容...

$$ 数学公式 $$
```

## 🛠️ 自定义

### 修改主题色

编辑 `css/main.css` 中的 CSS 变量：

```css
:root {
  --primary-color: #4A90D9;     /* 主色调 */
  --success-color: #58CC02;     /* 完成/成功色 */
  --warning-color: #FFC800;     /* 警告色 */
  --danger-color: #FF4B4B;      /* 危险色 */
}
```

### 修改 APP 名称

1. 编辑 `manifest.json` 中的 `name` 和 `short_name`
2. 编辑 `index.html` 中的 `<title>`

## 📊 内容来源

本应用的内容基于 [maths-cs-ai-compendium](https://github.com/HenryNdubuaku/maths-cs-ai-compendium) 开源项目。

## 📝 待办事项

- [ ] 更多内容章节
- [ ] 测验系统
- [ ] 学习成就/徽章
- [ ] 导出/导入进度
- [ ] 深色模式
- [ ] 多语言支持

## 📄 开源协议

MIT License
