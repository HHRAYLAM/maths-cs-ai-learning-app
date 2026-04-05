# 📱 离线学习使用指南

## 方案一：单文件离线版（推荐）

### 生成离线文件

在电脑上运行：

```bash
# 进入项目目录
cd math-cs-ai-learning-app

# 运行打包脚本
node build-offline.js
```

生成的文件位置：`dist/index-offline.html` (约 1.8MB)

### 使用方法

1. **复制到手机/平板**
   - 通过微信文件传输助手、QQ、AirDrop 等方式发送 `index-offline.html`
   - 保存到设备的「文件」App 或任意位置

2. **打开学习**
   - 用手机浏览器（Safari/Chrome）直接打开 `index-offline.html`
   - 或添加到主屏幕，像 App 一样使用

3. **添加到主屏幕（可选）**
   - **iPhone**: Safari 打开 → 分享 → 添加到主屏幕
   - **Android**: Chrome 打开 → 菜单 → 添加到主屏幕

### 特点

- ✅ 完全离线，无需网络
- ✅ 包含所有课程内容（100+ 节课）
- ✅ 学习进度本地保存
- ✅ 支持所有功能（依赖图、练习题、费曼模式等）

---

## 方案二：PWA 在线缓存

### 使用方法

1. 打开 https://hhraylam.github.io/maths-cs-ai-learning-app/
2. 等待页面加载完成
3. 点击「一键缓存」按钮
4. 等待缓存完成（约 1-2 分钟）

### 离线使用

- 飞行模式下也能打开
- 已缓存的内容可以正常学习
- 学习进度自动保存

---

## 方案三：完整项目离线

### 下载项目

```bash
git clone https://github.com/HHRAYLAM/maths-cs-ai-learning-app.git
```

### 本地启动

```bash
cd maths-cs-ai-learning-app

# 方式 1: Python
python -m http.server 8000

# 方式 2: Node.js
npx serve .
```

然后用浏览器打开 `http://localhost:8000`

---

## 常见问题

### Q: 离线版更新怎么办？
A: 重新运行 `node build-offline.js` 生成新版本，替换旧文件即可。

### Q: 学习进度会丢失吗？
A: 进度保存在浏览器 LocalStorage，只要不清除浏览器数据，进度会一直保留。

### Q: 可以在多个设备间同步进度吗？
A: 离线版不支持同步。如需多设备同步，请使用在线版（PWA）。

### Q: 文件太大，手机存不下怎么办？
A: 1.8MB 的文件很小，现代手机至少有几 GB 可用空间。如果实在存不下，可以使用方案二（PWA 缓存）。

---

## 学习内容

当前版本包含：
- 📚 20 个章节
- 📖 100+ 节课程
- 🎯 完整依赖关系图
- 📝 练习题
- 🎓 费曼学习模式
- ⭐ 成就系统
- 📊 学习进度统计

涵盖：线性代数、微积分、统计学、概率论、机器学习、NLP、计算机视觉、音频处理、多模态、机器人、图神经网络、数据结构与算法、软件工程、GPU 编程等。

---

祝学习愉快！✈️📚
