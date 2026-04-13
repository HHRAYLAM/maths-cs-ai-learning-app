# Tom & Jerry 主题整合完成记录

## 已完成修改的章节

### 第 5 章：概率论

#### 01. counting.md (第 5 章第 1 课) ✓
- **主题**：Tom 的陷阱排列组合
- **新增内容**：
  - 开篇故事：Tom 设计陷阱组合（3 种诱饵 × 4 种陷阱 × 3 个位置）
  - 所有示例改为 Tom & Jerry 场景
  - 添加 story-card 和 visual-hint 组件
  - Jerry 的观察和理解卡片

#### 02. probability concepts.md (第 5 章第 2 课) ✓
- **主题**：Tom 的抓鼠成功率计算
- **新增内容**：
  - 开篇故事：Tom 计算 15% 成功率
  - 医疗诊断示例改为"Jerry 的医疗课"
  - 贝叶斯定理用 Tom 的陷阱成功条件概率解释
  - 添加补集、互斥事件、条件概率的 Tom & Jerry 示例

#### 03. distributions.md (第 5 章第 3 课) ✓
- **主题**：Tom 的抓鼠结果预测
- **新增内容**：
  - 伯努利：Tom 单次捕鼠尝试 (p=0.15)
  - 二项式：8 次陷阱成功次数
  - 泊松：Jerry 每小时出现λ=3 次
  - 几何：直到第一次成功的等待时间 (6.67 次)
  - 负二项：等待第 3 次成功
  - 正态：Tom 的抓鼠时间分布 N(30, 5²)
  - 指数：两次出现间等待时间
  - Beta：Tom 的信念更新
  - 所有分布添加 story-card 和 visual-hint

#### 04. bayesian.md (第 5 章第 4 课) ✓
- **主题**：Tom 如何更新它的抓鼠信念
- **新增内容**：
  - MLE/MAP 用 Tom 的捕鼠成功率估计
  - 完整贝叶斯推断用 Tom 的信念更新
  - 马尔可夫链：Tom 的捕鼠策略转移
  - HMM：Tom 推断 Jerry 位置（隐藏状态）
  - Viterbi 算法：Tom 追踪 Jerry 行踪
  - Baum-Welch：EM 算法的 Jerry 理解
  - CRF：Tom 看整周奶酪模式
  - 编码任务全部改为 Tom & Jerry 场景
  - 添加小测验和课后练习

#### 05. information theory.md (第 5 章第 5 课) ✓
- **主题**：Tom 的奶酪情报局
- **状态**：已有很好的主题整合，无需修改
- **现有内容**：
  - 惊喜度：Jerry 被抓住的稀有事件
  - 熵：奶酪工厂的不确定性
  - 交叉熵损失：模型预测的惊喜度
  - KL 散度：分布间的差异
  - 完整的 story-card 和 visual-hint 组件

### 第 6 章：机器学习

#### 01. classical machine learning.md (第 6 章第 1 课) ✓
- **主题**：Tom 的奶酪预测工厂
- **状态**：已有很好的主题整合

#### 02. gradient machine learning.md (第 6 章第 2 课) ✓
- **主题**：Tom 的奶酪山谷寻宝
- **状态**：已有很好的主题整合

## 修改模式总结

### 1. 开篇故事
每章开头添加"今日故事"，用 Tom & Jerry 场景引入学习主题

### 2. 故事卡片 (story-card)
```html
<div class="story-card">
  <div class="story-card-title">🐱 Tom 的 XXX 理解</div>
  <div class="story-card-content">
    用 Tom & Jerry 场景解释概念
  </div>
</div>
```

### 3. Jerry 的理解卡片
```html
<div class="story-card jerry">
  <div class="story-card-title">🐭 Jerry 的 XXX 理解</div>
  <div class="story-card-content">
    从 Jerry 视角解释概念
  </div>
</div>
```

### 4. 视觉提示 (visual-hint)
```html
<div class="visual-hint animate-wiggle">
  💡 **概念**：用 Tom & Jerry 比喻解释
</div>
```

### 5. 编码任务改造
所有 Python 代码示例中的变量名、注释、输出都改为 Tom & Jerry 场景

### 6. 小测验和总结
每章结尾添加：
- 🧀 小测验（带答案）
- 📝 本课总结
- 下一课预告
- 📚 课后练习

## 设计原则

1. **保持技术准确性**：比喻不改变数学内容
2. **一致性**：Tom 始终是学习者/应用者，Jerry 是理解者/解释者
3. **适度幽默**：故事卡片增加趣味性但不分散注意力
4. **渐进式**：从简单概念到复杂应用都有故事支撑

## 后续建议

如需继续整合后续章节，建议按以下顺序：
1. 第 6 章第 3-5 课（深度学习、强化学习、分布式）
2. 第 7 章计算语言学
3. 第 8 章计算机视觉
4. 其他应用章节

## 文件统计

| 修改类型 | 文件数 |
|---------|-------|
| 完整重写（添加故事框架） | 4 |
| 已有良好主题 | 3 |
| 待修改 | 剩余章节 |

---

*最后更新：2026-04-13*
*修改者：Claude Code*
