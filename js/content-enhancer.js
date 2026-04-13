// 课程内容增强工具 - 添加猫和老鼠比喻和故事

const ContentEnhancer = {
  // 每章的 Tom & Jerry 故事引言
  chapterStories: {
    'ch01': {
      title: 'Tom 的追逐游戏',
      character: '🐱',
      story: `Tom 猫想要抓住 Jerry 老鼠，但它们住在一个充满数学魔法的房子里。为了成功追逐，Tom 需要学习**向量**的知识！想象一下，每次 Tom 看到 Jerry 时，它都需要计算：我应该往哪个方向跑？需要跑多远？这就是向量的两个核心要素——方向和大小。`,
      metaphor: '向量 = Tom 的追逐指令卡'
    },
    'ch02': {
      title: 'Tom 的变身术',
      character: '🐱‍👤',
      story: `有一天，Tom 发现了一面神奇的镜子——矩阵！这面镜子可以旋转、缩放、甚至翻转 Tom 的身体。当 Tom 站在镜子前，它不再是简单的平移，而是可以进行各种变换：旋转 90 度扑向 Jerry，放大 2 倍吓唬小老鼠，或者翻转过来做鬼脸。`,
      metaphor: '矩阵 = 魔法变换器'
    },
    'ch03': {
      title: 'Jerry 的逃跑速度',
      character: '🐭',
      story: `Jerry 老鼠正在逃跑！它一开始跑得很快，然后慢慢减速... 这种"变化的变化"就是微积分的核心。牛顿和莱布尼茨发现，世界上的任何变化都可以用微分和积分来描述——就像 Jerry 的逃跑路线一样。`,
      metaphor: '导数 = 瞬时速度，积分 = 累积距离'
    },
    'ch04': {
      title: 'Tom 的统计分析',
      character: '🐱📊',
      story: `Tom 抓了 100 次 Jerry，但只成功了 3 次。它开始思考：我的平均成功率是多少？为什么有时候表现好，有时候表现差？统计学帮助 Tom 分析它的抓捕数据，找到改进的方法。`,
      metaphor: '均值 = 平均水平，方差 = 发挥稳定性'
    },
    'ch05': {
      title: 'Tom 能抓住 Jerry 吗？',
      character: '🎲',
      story: `Tom 每次扑向 Jerry 时，都在进行一场概率游戏。根据 Jerry 的位置、自己的速度、地面的摩擦力... Tom 计算出它有 23.7% 的概率成功。这就是概率论——研究不确定性中的确定性规律。`,
      metaphor: '概率 = 预测未来的水晶球'
    },
    'ch06': {
      title: 'Tom 的机器学习日记',
      character: '🤖🐱',
      story: `Tom 决定用科技来抓 Jerry！它开始训练一个 AI 模型，输入是 Jerry 的位置、速度、逃跑方向... 经过无数次失败（被老鼠夹、捕鼠笼、各种陷阱），Tom 的模型终于能预测 Jerry 的行动了！这就是机器学习的魔力——从数据中学习规律。`,
      metaphor: '机器学习 = Tom 的抓捕经验累积'
    },
    'ch07': {
      title: 'Tom 学说话',
      character: '🐱💬',
      story: `有一天，Tom 突发奇想：如果能听懂 Jerry 的语言就好了！它开始分析 Jerry 的叫声频率、音节模式、语法结构... 这就是自然语言处理（NLP）的核心——让计算机理解和生成人类语言。`,
      metaphor: 'NLP = 翻译猫鼠语言'
    },
    'ch08': {
      title: 'Tom 的视觉系统',
      character: '🐱👁️',
      story: `Tom 想要更好地理解它看到的世界。它学会了识别 Jerry 的形状、颜色、动作，甚至能预测 Jerry 下一秒出现在哪里。这就是计算机视觉——让机器"看懂"图像和视频。`,
      metaphor: '计算机视觉 = Tom 的火眼金睛'
    },
    'ch09': {
      title: 'Tom 听声音',
      character: '🐱👂',
      story: `即使在黑暗中，Tom 也能通过 Jerry 的脚步声、呼吸声来判断它的位置。这就是音频处理的神奇之处——从声音信号中提取有用信息。`,
      metaphor: '音频处理 = Tom 的顺风耳'
    },
    'ch10': {
      title: 'Tom 的多感官世界',
      character: '🐱👁️👂',
      story: `Tom 发现，单靠视觉或听觉都不够完美。只有把看到的和听到的结合起来，才能准确抓住 Jerry！这就是多模态学习——融合多种感官信息，做出更好的判断。`,
      metaphor: '多模态 = 眼耳并用'
    },
    'ch11': {
      title: 'Tom 变成机器人',
      character: '🤖',
      story: `Tom 把自己改装成了机器人！现在它能自动感知环境、规划路径、避开障碍物，还能自主学习新的抓捕技能。这就是自主系统——能感知、决策、行动的智能机器。`,
      metaphor: '自主系统 = 自动化的 Tom'
    },
    'ch12': {
      title: 'Tom 的社交网络',
      character: '🕸️🐱',
      story: `Tom 发现，房子之间的关系就像一张巨大的网：老鼠洞连接厨房，厨房连接客厅，客厅连接花园... 这就是图论的世界！用节点和边来描述复杂的关系网络。`,
      metaphor: '图网络 = 房子的关系网'
    },
    'ch13': {
      title: 'Tom 的计算机',
      character: '💻🐱',
      story: `Tom 想要自己组装一台计算机来抓 Jerry。它学习了 CPU 如何运算、内存如何存储、操作系统如何管理任务... 这就是计算机系统的奥秘！`,
      metaphor: '计算机系统 = Tom 的大脑构造'
    },
    'ch14': {
      title: 'Tom 的算法秘籍',
      character: '⚔️🐱',
      story: `Tom 得到了一本算法秘籍！里面记载了如何高效地搜索 Jerry 的位置、如何排序抓捕优先级、如何用动态规划找出最优抓捕路线...`,
      metaphor: '算法 = 抓捕效率秘籍'
    },
    'ch15': {
      title: 'Tom 的软件工程',
      character: '🏗️🐱',
      story: `Tom 的抓捕系统越来越复杂，它需要学习如何组织代码、如何测试功能、如何部署上线... 这就是软件工程的精髓——构建可靠、可维护的大型系统。`,
      metaphor: '软件工程 = 系统化抓捕方案'
    },
    'ch16': {
      title: 'Tom 的超级计算',
      character: '🚀🐱',
      story: `Tom 不满足于普通计算速度，它开始研究 SIMD、GPU 并行计算、CUDA 加速... 要让抓捕计算跑得更快！`,
      metaphor: '高性能计算 = 超级 Tom 引擎'
    },
    'ch17': {
      title: 'Tom 的推理优化',
      character: '⚡🐱',
      story: `Tom 发现它的 AI 模型太大了，运行太慢。它开始学习量化、剪枝、蒸馏... 让模型变小变快，但依然保持准确的抓捕预测！`,
      metaphor: '模型优化 = 轻量化 Tom'
    },
    'ch18': {
      title: 'Tom 的系统设计',
      character: '🏢🐱',
      story: `Tom 的抓捕事业越做越大，它需要设计能支撑百万并发请求的系统！负载均衡、分布式存储、容错机制... 一个都不能少。`,
      metaphor: '系统设计 = 规模化抓捕架构'
    },
    'ch19': {
      title: 'Tom 的应用领域',
      character: '🌍🐱',
      story: `Tom 的技术不只是为了抓 Jerry！它发现同样的技术可以用在金融预测、药物研发、蛋白质设计... 世界需要 AI！`,
      metaphor: '应用 AI = Tom 的多元发展'
    },
    'ch20': {
      title: 'Tom 的未来科技',
      character: '🔮🐱',
      story: `Tom 展望未来：量子计算能让它瞬间预测所有可能的抓捕路线，脑机接口让它直接读取 Jerry 的想法... 未来已来！`,
      metaphor: '前沿 AI = 未来 Tom 科技'
    }
  },

  // 为课程内容添加故事卡片
  enhanceLessonContent(markdown, lesson) {
    // 检查是否是章节的第一课
    const isFirstLesson = this.isFirstLessonOfChapter(lesson);

    if (isFirstLesson && lesson.chapterId) {
      const story = this.chapterStories[lesson.chapterId];
      if (story) {
        // 在内容开头添加故事卡片
        const storyCard = this.createStoryCard(story);
        return storyCard + '\n\n' + markdown;
      }
    }

    // 为特定概念添加比喻提示框
    markdown = this.addMetaphorHints(markdown, lesson);

    return markdown;
  },

  // 创建故事卡片 HTML
  createStoryCard(story) {
    return `
<div class="story-card animate-bounce-in">
  <div style="display: flex; align-items: flex-start; gap: 12px;">
    <span class="story-card-character">${story.character}</span>
    <div>
      <div class="story-card-title" style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <span>📖 ${story.title}</span>
      </div>
      <div class="story-card-content" style="line-height: 1.8; color: var(--text-secondary);">
        ${story.story}
      </div>
      <div style="margin-top: 16px; padding: 12px 16px; background: rgba(255, 217, 61, 0.15); border-radius: 8px; border-left: 3px solid var(--cheese-yellow);">
        <strong>💡 核心比喻</strong>：${story.metaphor}
      </div>
    </div>
  </div>
</div>
`;
  },

  // 检查是否是章节的第一课
  isFirstLessonOfChapter(lesson) {
    if (!lesson || !lesson.chapterId) return false;

    // 获取章节
    const chapter = Content.getChapter(lesson.chapterId);
    if (!chapter || !chapter.lessons || chapter.lessons.length === 0) return false;

    // 检查是否是第一个
    return chapter.lessons[0].id === lesson.id;
  },

  // 为特定概念添加比喻提示
  addMetaphorHints(markdown, lesson) {
    const metaphors = {
      // 线性代数概念
      '向量': '🐱 **Tom 视角**：向量就像你给 Tom 的指令——"向右 3 步，向上 4 步"，既有方向又有距离！',
      '矩阵': '🪞 **魔法镜子**：矩阵就像一个魔法镜子，可以把 Tom 旋转、缩放、翻转，但不会改变它的本质（特征值）！',
      '特征值': '✨ **不变的核心**：特征值是矩阵变换后仍然保持不变的东西——就像 Tom 无论怎么变身，它还是那只贪吃的猫！',
      '特征向量': '🎯 **特殊方向**：特征向量是矩阵变换后方向不变的向量——就像 Tom 照镜子时，只有某些角度不会变形！',
      '线性变换': '🔄 **Tom 变身术**：线性变换就是把 Tom 进行旋转、缩放、剪切，但保持网格线平行！',
      '特征分解': '🔑 **解锁矩阵**：特征分解就是把矩阵拆解成简单的旋转和缩放——就像分析 Tom 的变身公式！',
      '奇异值分解': '📦 **万能分解**：SVD 可以把任何矩阵分解成三个简单操作——Tom 的变身三连招！',

      // 微积分概念
      '导数': '🏃 **瞬时速度**：导数就是 Jerry 在某一瞬间的逃跑速度——不是平均速度，而是此时此刻的速度！',
      '微分': '🔬 **放大细节**：微分就是把曲线放大到无穷小，看看它在这一点的变化率——就像用显微镜看 Jerry 的脚步！',
      '积分': '📏 **累积距离**：积分就是计算 Jerry 从起点到现在跑了多远——把每一小段距离加起来！',
      '梯度': '⛰️ **最陡山坡**：梯度就像 Tom 爬山时最陡的方向——沿着这个方向走，高度变化最快！',
      '偏导数': '📐 **单方向变化**：偏导数只看向一个方向的变化率——就像 Tom 只关心 Jerry 横向跑了多远！',
      '链式法则': '🔗 **连锁反应**：链式法则就像 Tom 追 Jerry，Jerry 追奶酪——一层层传递的变化！',
      '泰勒展开': '📈 **局部逼近**：泰勒展开用多项式逼近复杂函数——就像用简单动作模仿 Tom 的复杂舞步！',

      // 概率统计概念
      '概率': '🎯 **成功率**：概率告诉 Tom，它扑向 Jerry 的成功率有多少——通常是 0% 到 100% 之间的一个数。',
      '条件概率': '🔍 **已知条件下的概率**：已知 Jerry 在厨房里，Tom 在厨房抓到它的概率是多少？这就是条件概率！',
      '贝叶斯定理': '🔄 **更新信念**：贝叶斯定理帮助 Tom 根据新证据更新判断——看到老鼠脚印后，Jerry 在附近的概率增加了！',
      '期望值': '💰 **平均收益**：期望值是长期平均结果——Tom 抓 100 次 Jerry，平均能成功几次？',
      '方差': '📊 **波动程度**：方差衡量数据的离散程度——Tom 的抓捕表现时好时坏，方差就大！',
      '正态分布': '🔔 **钟形曲线**：正态分布是最常见的分布——就像 Tom 的抓捕成功率，大多数时候接近平均值！',
      '中心极限定理': '🎲 **大数定律**：中心极限定理说，大量独立随机变量的和趋向正态分布——Tom 抓很多次 Jerry，平均成功率会稳定！',
      '假设检验': '🧪 **验证猜想**：假设检验帮助 Tom 验证"我的新陷阱更有效"这个假设是否成立！',

      // 机器学习概念
      '机器学习': '🤖 **经验积累**：机器学习让 Tom 从历史数据中学习——被抓 100 次后，Tom 学会预测 Jerry 的行动！',
      '梯度下降': '🏔️ **下山找最低点**：梯度下降就像 Tom 蒙着眼睛下山——沿着最陡方向走，找到山谷最低点（最优解）！',
      '损失函数': '📉 **误差度量**：损失函数衡量预测和实际的差距——Tom 预测 Jerry 位置偏差多远！',
      '反向传播': '🔙 **误差传递**：反向传播把误差从输出层传回输入层——就像 Tom 从结果反推哪里做错了！',
      '神经网络': '🧠 **模拟大脑**：神经网络由多层神经元组成——就像 Tom 的大脑，层层处理信息！',
      '卷积': '👓 **模糊滤镜**：卷积就像 Tom 戴上墨镜看世界——每个像素都和周围的像素混合，产生模糊效果。',
      '池化': '🔍 **降采样**：池化把大图片变小——就像 Tom 眯眼看世界，保留主要特征，忽略细节！',
      '注意力机制': '👀 **聚焦重点**：注意力机制让模型关注重要部分——就像 Tom 只盯着 Jerry，忽略其他干扰！',
      'Transformer': '🔄 **自注意力架构**：Transformer 用自注意力处理序列——Tom 同时关注 Jerry 的所有动作！',
      '强化学习': '🎮 **试错学习**：强化学习通过奖励和惩罚学习——抓到 Jerry 得奖励，失败受惩罚，Tom 逐渐变聪明！',

      // 计算机科学概念
      '哈希表': '🗂️ **快速查找**：哈希表像 Tom 的储物柜——给个钥匙就能快速找到对应的东西！',
      '递归': '🔄 **自我调用**：递归就是函数调用自己——就像 Tom 照镜子，镜子里还有镜子！',
      '动态规划': '📝 **记住历史**：动态规划把大问题拆成小问题，记住每个子问题的答案——Tom 记录每次抓捕路线！',
      '图': '🕸️ **关系网络**：图由节点和边组成——就像房子里各房间的连接关系！',
      '树': '🌳 **层级结构**：树是特殊的图，有根节点和子节点——就像 Tom 的家谱树！',
      '时间复杂度': '⏱️ **执行时间**：时间复杂度描述算法随输入规模增长的耗时——Tom 找 Jerry 需要多长时间？',
      '空间复杂度': '💾 **占用内存**：空间复杂度描述算法需要的内存空间——Tom 的抓捕计划需要多少张纸？',

      // 深度学习概念
      '深度学习': '🧠**多层神经网络**：深度学习用多层网络学习复杂模式——Tom 的大脑层层处理视觉信息！',
      'Dropout': '🚫**随机失活**：Dropout 训练时随机关闭部分神经元——就像 Tom 偶尔闭上一只眼训练，让它更鲁棒！',
      'BatchNorm': '⚖️**批量归一化**：BatchNorm 让每层输入保持稳定的分布——就像统一 Tom 每餐的食量！',
      '残差连接': '🌉**跳跃连接**：残差连接让信息直接跨层传递——就像 Tom 坐电梯直达楼上，不用爬楼梯！',

      // 自然语言处理概念
      '词嵌入': '📍**词向量**：词嵌入把词映射到向量空间——就像给每个单词一个 Tom 风格的坐标！',
      'RNN': '🔄**循环网络**：RNN 处理序列数据，有记忆功能——Tom 记住 Jerry 之前的位置预测下一步！',
      'LSTM': '🧠**长短期记忆**：LSTM 能记住长期依赖——Tom 记得 Jerry 十分钟前的位置！',
      '注意力': '👀**关注重点**：注意力机制让模型关注重要部分——Tom 只盯着 Jerry，忽略其他干扰！',

      // 计算机视觉概念
      'CNN': '👁️**卷积网络**：CNN 用卷积核提取图像特征——Tom 的眼睛识别 Jerry 的轮廓！',
      '目标检测': '🎯**定位 + 识别**：目标检测找出物体位置并分类——Tom 发现"Jerry 在厨房角落"！',
      '图像分割': '✂️**像素级分类**：图像分割给每个像素打标签——Tom 区分哪里是 Jerry，哪里是背景！',
      'GAN': '🎨**生成对抗网络**：GAN 有生成器和判别器互相较量——Tom 学画 Jerry，另一只 Tom 判断真假！',

      // 其他概念
      '量化': '📏**精度压缩**：量化用低精度数字表示模型——就像 Tom 用简化版地图抓 Jerry！',
      '剪枝': '✂️**去除冗余**：剪枝去掉网络中不重要的连接——Tom 去掉不必要的抓捕动作！',
      '蒸馏': '🍯**知识浓缩**：知识蒸馏把大模型知识传到小模型——老 Tom 把经验传给小 Tom！',
      '边缘计算': '📱**本地处理**：边缘计算在设备本地运行——Tom 的脑子直接处理，不用问云端！'
    };

    // 在 Markdown 中查找并插入比喻
    for (const [concept, metaphor] of Object.entries(metaphors)) {
      const regex = new RegExp(`(${concept})`, 'g');
      if (markdown.includes(concept) && !markdown.includes(metaphor)) {
        // 在概念第一次出现后添加提示框
        const hintBox = `\n\n<div class="visual-hint animate-wiggle">💡 ${metaphor}</div>\n\n`;
        markdown = markdown.replace(regex, (match) => {
          if (match === concept) {
            return concept + hintBox;
          }
          return match;
        });
      }
    }

    return markdown;
  }
};

// 导出到全局
window.ContentEnhancer = ContentEnhancer;
