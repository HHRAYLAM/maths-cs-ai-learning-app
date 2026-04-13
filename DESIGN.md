# DESIGN.md - 数学/CS/AI 学习应用 (猫和老鼠主题)

> 设计系统文档 - 基于 Google Stitch DESIGN.md 格式  
> 灵感来源：Tom & Jerry 经典卡通风格  
> 参考：[awesome-design-md](https://github.com/VoltAgent/awesome-design-md)

---

## 🎨 品牌色彩

### 主色调

| 名称 | 色值 | 用途 |
|------|------|------|
| **Tom Blue** (汤姆蓝) | `#4A90D9` | 主按钮、链接、进度条 |
| **Tom Grey** (汤姆灰) | `#808990` | 次要元素、边框 |
| **Jerry Brown** (杰瑞棕) | `#CD8309` | 强调色、警告、成就徽章 |
| **Jerry Tan** (杰瑞褐) | `#FECE87` | 背景高亮、卡片底色 |

### 辅助色

| 名称 | 色值 | 用途 |
|------|------|------|
| **Soft Salmon** (柔粉) | `#F3A598` | 爱心、收藏、女性化元素 |
| **Cream White** (奶油白) | `#FFF8E7` | 主背景色 |
| **Pitch Black** (纯黑) | `#1A1A2E` | 文字、深色元素 |
| **Success Green** (成功绿) | `#4ADE80` | 完成状态、正确反馈 |
| **Error Red** (错误红) | `#F87171` | 错误提示、警告 |

### 渐变色

```css
--gradient-tom: linear-gradient(135deg, #4A90D9 0%, #6BA3E0 100%);
--gradient-jerry: linear-gradient(135deg, #CD8309 0%, #E09B1F 100%);
--gradient-sunset: linear-gradient(135deg, #F3A598 0%, #FECE87 100%);
```

---

## 📐 间距系统

基于 4px 网格系统：

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

---

## 🔤 字体系统

### 中文字体栈

```css
font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
```

### 英文字体栈

```css
font-family: 'Comic Sans MS', 'Chalkboard', 'Arial Rounded MT Bold', sans-serif;
```

### 字号层级

| 级别 | 名称 | 大小 | 行高 | 用途 |
|------|------|------|------|------|
| `text-xs` | 超小 | 12px | 1.4 | 注释、标签 |
| `text-sm` | 小 | 14px | 1.5 | 辅助文字 |
| `text-base` | 基础 | 16px | 1.6 | 正文内容 |
| `text-lg` | 大 | 18px | 1.6 | 小标题 |
| `text-xl` | 超大 | 20px | 1.7 | 章节标题 |
| `text-2xl` | 特大 | 24px | 1.7 | 页面标题 |
| `text-3xl` | 巨大 | 30px | 1.8 | 品牌标识 |

### 字重

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-bold: 700;
```

---

## 📱 圆角系统

```css
--radius-sm: 4px;      /* 小按钮、标签 */
--radius-md: 8px;      /* 卡片、输入框 */
--radius-lg: 12px;     /* 大卡片、模态框 */
--radius-xl: 16px;     /* 特色卡片 */
--radius-full: 9999px; /* 圆形头像、徽章 */
```

---

## ✨ 阴影系统

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

/* 卡通风格阴影 - 更夸张的偏移 */
--shadow-cartoon: 4px 4px 0px rgba(0, 0, 0, 0.2);
--shadow-cartoon-hover: 6px 6px 0px rgba(0, 0, 0, 0.2);
```

---

## 🎭 组件样式

### 按钮

```css
.btn-primary {
  background: #4A90D9;
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.2);
}

.btn-primary:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: #FECE87;
  color: #1A1A2E;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
}

.btn-outline {
  background: transparent;
  color: #4A90D9;
  border: 2px solid #4A90D9;
  border-radius: 12px;
  padding: 10px 22px;
  font-weight: 600;
}
```

### 卡片

```css
.card {
  background: #FFF8E7;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid #FECE87;
}

.card-interactive {
  background: #FFF8E7;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.15);
  border: 2px solid #4A90D9;
  transition: all 0.2s ease;
  cursor: pointer;
}

.card-interactive:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.15);
}
```

### 进度条

```css
.progress-bar {
  background: linear-gradient(90deg, #4A90D9 0%, #6BA3E0 100%);
  border-radius: 9999px;
  height: 12px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
}

.progress-track {
  background: #E5E5E5;
  border-radius: 9999px;
  height: 12px;
}
```

### 徽章

```css
.badge {
  background: #4A90D9;
  color: white;
  border-radius: 9999px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge-success {
  background: #4ADE80;
  color: #064E3B;
}

.badge-warning {
  background: #CD8309;
  color: white;
}

.badge-pending {
  background: #808990;
  color: white;
}
```

### 导航栏

```css
.navbar {
  background: linear-gradient(135deg, #4A90D9 0%, #6BA3E0 100%);
  color: white;
  padding: 16px 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nav-item {
  color: white;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.3);
  font-weight: 700;
}
```

---

## 🎬 动画系统

### 过渡时间

```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
```

### 缓动函数

```css
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### 关键帧动画

```css
@keyframes bounce-in {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

@keyframes slide-up {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes celebrate {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.1) rotate(-3deg); }
  50% { transform: scale(1.1) rotate(3deg); }
  75% { transform: scale(1.1) rotate(-3deg); }
}
```

### 动画类

```css
.animate-bounce-in {
  animation: bounce-in 0.5s var(--ease-spring);
}

.animate-wiggle {
  animation: wiggle 0.3s ease-in-out;
}

.animate-slide-up {
  animation: slide-up 0.4s var(--ease-smooth);
}

.animate-celebrate {
  animation: celebrate 0.6s var(--ease-spring);
}
```

---

## 🖼️ 图片风格

### 插图风格

- **卡通风格**: 粗轮廓线 (2px)，纯色填充
- **表情夸张**: 大眼睛、丰富的面部表情
- **动作感**: 使用速度线、动作模糊效果
- **色彩饱和**: 高饱和度、明快色调

### 图标风格

```css
.icon {
  width: 24px;
  height: 24px;
  stroke-width: 2.5px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.icon-large {
  width: 32px;
  height: 32px;
  stroke-width: 3px;
}

.icon-small {
  width: 18px;
  height: 18px;
  stroke-width: 2px;
}
```

---

## 📐 布局系统

### 网格

```css
.grid {
  display: grid;
  gap: 16px;
}

.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

/* 响应式断点 */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

### 双栏阅读布局

```css
.lesson-two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.lesson-text {
  background: #FFF8E7;
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #FECE87;
}

.lesson-image {
  background: #FFF;
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #4A90D9;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 1024px) {
  .lesson-two-column {
    grid-template-columns: 1fr;
  }
}
```

---

## 🎮 游戏化元素

### 成就徽章

```css
.achievement-badge {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #CD8309 0%, #FFD700 100%);
  border: 3px solid #FFF;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.achievement-locked {
  filter: grayscale(100%);
  opacity: 0.5;
}
```

### 进度星星

```css
.star {
  width: 40px;
  height: 40px;
  fill: #CD8309;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.star-empty {
  fill: #E5E5E5;
}

.star-partial {
  fill: url(#star-gradient);
}
```

---

## 🎯 设计原则

### 核心设计理念

1. ** playful 有趣**: 保持学习的趣味性，避免枯燥
2. **Friendly 友好**: 温暖、亲切的视觉感受
3. **Clear 清晰**: 内容层次分明，易于阅读
4. **Responsive 响应**: 动画流畅，交互自然

### 猫和老鼠元素融入

| 元素 | 应用位置 | 说明 |
|------|----------|------|
| Tom 蓝色 | 主按钮、进度、成功状态 | 代表稳定、专业 |
| Jerry 棕色 | 强调、成就、奖励 | 代表活力、趣味 |
| 卡通阴影 | 卡片、按钮 | 增强立体感和趣味性 |
| 弹跳动画 | 成功反馈、新内容出现 | 增加趣味性 |
| 粗轮廓 | 图标、插图 | 卡通风格统一 |

---

## 📱 响应式设计

### 移动端优先

```css
/* 手机优先 (默认) */
.container { padding: 16px; }

/* 平板 (≥768px) */
@media (min-width: 768px) {
  .container { padding: 24px; }
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}

/* 桌面 (≥1024px) */
@media (min-width: 1024px) {
  .container { padding: 32px; max-width: 1200px; margin: 0 auto; }
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}
```

---

## 🔧 使用指南

### 在 CSS 中使用

```css
@import './design-tokens.css';

.my-button {
  @apply btn-primary;
  @apply animate-bounce-in;
}
```

### 在 HTML 中使用

```html
<button class="btn-primary animate-bounce-in">
  开始学习
</button>

<div class="card card-interactive">
  <h3 class="text-xl">课程标题</h3>
  <p class="text-base">课程描述...</p>
</div>

<div class="progress-track">
  <div class="progress-bar" style="width: 75%;"></div>
</div>
```

---

## 📚 参考资源

- [Google Stitch](https://stitch.withgoogle.com/) - AI 驱动的 UI 设计工具
- [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) - DESIGN.md 文件集合
- [Tom & Jerry Color Palette](https://www.schemecolor.com/tom-and-jerry.php) - 官方配色
- [Dribbble - Playful App](https://dribbble.com/search/playful-app) - 趣味应用设计灵感
- [Behance - Kids Learning App](https://www.behance.net/search/projects/kids%20learning%20app) - 儿童学习应用案例

---

*最后更新：2026 年 4 月 11 日*  
*版本：v1.0*  
*主题：猫和老鼠 (Tom & Jerry)*
