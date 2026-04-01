// 练习题数据

const QuizData = {
  // 练习题存储
  quizzes: {},

  // 初始化所有章节的练习题
  init() {
    this.quizzes = {
      // ============ 第一章：向量 ============
      'ch01-l01': {
        lessonTitle: '向量空间',
        questions: [
          {
            type: 'choice',
            question: '向量 a = (3, 2, 4) 是几维向量？',
            options: ['2 维', '3 维', '4 维', '无法确定'],
            answer: 1,
            explanation: '向量有 3 个坐标分量，所以是 3 维向量，生活在 ℝ³ 空间中。'
          },
          {
            type: 'choice',
            question: '向量加法的几何意义是什么？',
            options: [
              '将一个向量拉长',
              '将一个向量旋转',
              '组合两个移动指令形成新指令',
              '将一个向量翻转'
            ],
            answer: 2,
            explanation: '向量加法就像组合两个移动指令：如果 a 是"向前走 3 步"，b 是"向右走 2 步"，那么 a+b 就是"向前走 3 步且向右走 2 步"。'
          },
          {
            type: 'fill',
            question: '对于向量 a = (a₁, a₂) 和 b = (b₁, b₂)，它们的和是：a + b = (____, ____)（用 a₁, a₂, b₁, b₂ 表示）',
            answer: 'a1+b1,a2+b2',
            explanation: '向量加法是对应分量相加：a + b = (a₁ + b₁, a₂ + b₂)'
          },
          {
            type: 'choice',
            question: '标量乘法 2v 的几何意义是什么？（v 是一个向量）',
            options: [
              '将 v 的长度变为原来的 2 倍，方向不变',
              '将 v 旋转 2 弧度',
              '将 v 的长度变为原来的一半',
              '将 v 反向'
            ],
            answer: 0,
            explanation: '标量乘法是缩放：2v 表示将向量 v 的长度拉伸为原来的 2 倍，方向保持不变。'
          },
          {
            type: 'choice',
            question: '以下哪个是向量空间必须满足的条件？',
            options: [
              '必须包含零向量',
              '向量的数量必须是有限的',
              '所有向量长度必须相同',
              '向量必须是 2 维或 3 维的'
            ],
            answer: 0,
            explanation: '向量空间必须包含零向量（加法单位元），这是向量空间的公理之一。其他选项都不是必要条件。'
          }
        ]
      },
      'ch01-l02': {
        lessonTitle: '向量属性',
        questions: [
          {
            type: 'choice',
            question: '向量 a = (3, 4) 的长度（模）是多少？',
            options: ['5', '7', '12', '√7'],
            answer: 0,
            explanation: '向量的模：|a| = √(3² + 4²) = √(9 + 16) = √25 = 5'
          },
          {
            type: 'fill',
            question: '两个向量平行的条件是：它们的方向____或____。',
            answer: '相同，相反',
            explanation: '平行向量要么方向相同，要么方向相反（反向平行）。'
          },
          {
            type: 'choice',
            question: '向量 a = (1, 2) 和向量 b = (2, 4) 的关系是什么？',
            options: ['垂直', '平行', '既不垂直也不平行', '无法判断'],
            answer: 1,
            explanation: 'b = 2a，即 b 是 a 的 2 倍缩放，所以它们平行。'
          }
        ]
      },
      'ch01-l03': {
        lessonTitle: '范数与度量',
        questions: [
          {
            type: 'choice',
            question: '向量 v = (3, 4) 的 L2 范数（欧几里得范数）是多少？',
            options: ['5', '7', '12', '25'],
            answer: 0,
            explanation: 'L2 范数：||v||₂ = √(3² + 4²) = √25 = 5'
          },
          {
            type: 'choice',
            question: '向量 v = (3, -4, 5) 的 L1 范数是多少？',
            options: ['5', '12', '√50', '2'],
            answer: 1,
            explanation: 'L1 范数是各分量绝对值之和：||v||₁ = |3| + |-4| + |5| = 3 + 4 + 5 = 12'
          },
          {
            type: 'fill',
            question: 'L∞范数（无穷范数）等于向量各分量绝对值的____。',
            answer: '最大值',
            explanation: 'L∞范数定义为向量各分量绝对值中的最大值。'
          }
        ]
      },
      'ch01-l04': {
        lessonTitle: '向量积',
        questions: [
          {
            type: 'choice',
            question: '向量 a = (1, 2) 和 b = (3, 4) 的点积是多少？',
            options: ['12', '11', '10', '9'],
            answer: 1,
            explanation: '点积：a·b = 1×3 + 2×4 = 3 + 8 = 11'
          },
          {
            type: 'choice',
            question: '两个非零向量的点积为 0，说明它们的关系是什么？',
            options: ['平行', '垂直', '相等', '反向'],
            answer: 1,
            explanation: '点积为 0 意味着 cos(θ) = 0，即 θ = 90°，两向量垂直。'
          },
          {
            type: 'fill',
            question: '二维向量的叉积结果是一个____量（填"标"或"向"）。',
            answer: '标',
            explanation: '二维向量的叉积结果是一个标量（实际上是在 z 轴方向的分量）。'
          }
        ]
      },
      'ch01-l05': {
        lessonTitle: '基与对偶',
        questions: [
          {
            type: 'choice',
            question: '在 ℝ² 中，标准基向量是？',
            options: [
              '(1, 1) 和 (1, -1)',
              '(1, 0) 和 (0, 1)',
              '(2, 0) 和 (0, 2)',
              '(1, 1) 和 (0, 0)'
            ],
            answer: 1,
            explanation: 'ℝ² 的标准基是 e₁ = (1, 0) 和 e₂ = (0, 1)，任何向量都可以表示为它们的线性组合。'
          },
          {
            type: 'choice',
            question: 'ℝ³ 空间需要几个基向量？',
            options: ['2 个', '3 个', '4 个', '无数个'],
            answer: 1,
            explanation: 'ℝ³ 是 3 维空间，需要且只需要 3 个线性无关的基向量。'
          }
        ]
      },

      // ============ 第二章：矩阵 ============
      'ch02-l01': {
        lessonTitle: '矩阵属性',
        questions: [
          {
            type: 'choice',
            question: '一个 3×2 矩阵有多少个元素？',
            options: ['5 个', '6 个', '3 个', '2 个'],
            answer: 1,
            explanation: '3×2 矩阵有 3 行 2 列，共 3×2 = 6 个元素。'
          },
          {
            type: 'fill',
            question: '矩阵转置后，原来的第 i 行第 j 列元素变成第____行第____列。',
            answer: 'j,i',
            explanation: '转置的定义：(Aᵀ)ⱼᵢ = Aᵢⱼ，即行列互换。'
          },
          {
            type: 'choice',
            question: '单位矩阵的主对角线元素是什么？',
            options: ['全是 0', '全是 1', '从 1 递增', '从 n 递减'],
            answer: 1,
            explanation: '单位矩阵的定义：主对角线全是 1，其余位置全是 0。'
          }
        ]
      },
      'ch02-l02': {
        lessonTitle: '矩阵类型',
        questions: [
          {
            type: 'choice',
            question: '对称矩阵满足什么条件？',
            options: ['A = -A', 'A = Aᵀ', 'A = A⁻¹', 'A = 0'],
            answer: 1,
            explanation: '对称矩阵的定义：A = Aᵀ，即转置等于自身。'
          },
          {
            type: 'choice',
            question: '对角矩阵的非零元素在哪里？',
            options: [
              '第一行',
              '第一列',
              '主对角线',
              '副对角线'
            ],
            answer: 2,
            explanation: '对角矩阵的定义：只有主对角线上的元素可能非零，其余位置全为 0。'
          }
        ]
      },
      'ch02-l03': {
        lessonTitle: '矩阵运算',
        questions: [
          {
            type: 'choice',
            question: '两个 2×3 矩阵相加，结果是几维矩阵？',
            options: ['2×3', '3×2', '6×1', '无法相加'],
            answer: 0,
            explanation: '矩阵加法要求维度相同，2×3 + 2×3 = 2×3，对应位置元素相加。'
          },
          {
            type: 'choice',
            question: '矩阵 A 是 2×3，矩阵 B 是 3×2，它们能相乘吗？结果是什么维度？',
            options: [
              '不能相乘',
              '能，2×2',
              '能，3×3',
              '能，2×3'
            ],
            answer: 1,
            explanation: '矩阵乘法要求第一个矩阵的列数等于第二个矩阵的行数。2×3 × 3×2 = 2×2。'
          },
          {
            type: 'fill',
            question: '矩阵乘____满足交换律（填"法"或"不"）。',
            answer: '不',
            explanation: '矩阵乘法不满足交换律，即 AB ≠ BA（一般情况下）。'
          },
          {
            type: 'choice',
            question: '单位矩阵 I 与任何同维矩阵 A 相乘，结果是？',
            options: ['0', 'I', 'A', 'Aᵀ'],
            answer: 2,
            explanation: '单位矩阵是乘法的单位元：AI = IA = A。'
          }
        ]
      },
      'ch02-l04': {
        lessonTitle: '线性变换',
        questions: [
          {
            type: 'choice',
            question: '线性变换必须满足什么性质？',
            options: [
              '保持加法和标量乘法',
              '保持长度不变',
              '保持角度不变',
              '必须是可逆的'
            ],
            answer: 0,
            explanation: '线性变换的定义：T(u+v) = T(u)+T(v) 且 T(cv) = cT(v)。'
          },
          {
            type: 'choice',
            question: '旋转变换是线性变换吗？',
            options: ['是', '否', '有时是有时不是', '无法判断'],
            answer: 0,
            explanation: '旋转变换保持加法和标量乘法，是线性变换。可以用矩阵表示。'
          },
          {
            type: 'fill',
            question: '二维平面绕原点逆时针旋转θ角的变换矩阵是 [[cosθ, -sinθ], [____, ____]]。',
            answer: 'sinθ,cosθ,sin,cos',
            explanation: '旋转矩阵：[[cosθ, -sinθ], [sinθ, cosθ]]'
          }
        ]
      },
      'ch02-l05': {
        lessonTitle: '矩阵分解',
        questions: [
          {
            type: 'choice',
            question: 'LU 分解将矩阵分解为？',
            options: [
              '下三角矩阵和上三角矩阵的乘积',
              '两个对称矩阵的乘积',
              '正交矩阵和对角矩阵的乘积',
              '两个正交矩阵的乘积'
            ],
            answer: 0,
            explanation: 'LU 分解：A = LU，其中 L 是下三角矩阵，U 是上三角矩阵。'
          },
          {
            type: 'choice',
            question: '特征值分解要求矩阵必须是？',
            options: [
              '任意矩阵',
              '方阵',
              '对称矩阵',
              '正定矩阵'
            ],
            answer: 1,
            explanation: '特征值分解只能对方阵进行，因为只有方阵才有特征值和特征向量。'
          },
          {
            type: 'fill',
            question: '奇异值分解（SVD）可以将____矩阵分解（填"任意"或"方"）。',
            answer: '任意',
            explanation: 'SVD 的强大之处在于它可以对任意 m×n 矩阵进行分解：A = UΣVᵀ。'
          }
        ]
      },

      // ============ 第 14 章：数据结构与算法 ============
      'ch14-l00': {
        lessonTitle: '基础：Big O、递归、回溯、动态规划',
        questions: [
          {
            type: 'choice',
            question: '以下哪个时间复杂度最优（最快）？',
            options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'],
            answer: 3,
            explanation: '时间复杂度从优到劣：O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)。O(log n) 比 O(n) 更优。'
          },
          {
            type: 'choice',
            question: '二分查找的时间复杂度是？',
            options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
            answer: 1,
            explanation: '二分查找每次排除一半元素，时间复杂度为 O(log n)。'
          },
          {
            type: 'fill',
            question: '递归函数必须有____条件，否则会无限递归。',
            answer: '终止,基本情况，base case',
            explanation: '递归函数必须有终止条件（base case），当满足某个条件时直接返回，不再递归。'
          },
          {
            type: 'choice',
            question: '动态规划的核心思想是什么？',
            options: [
              '把大问题分解为小问题，避免重复计算',
              '使用更多的内存',
              '使用递归',
              '暴力枚举所有可能'
            ],
            answer: 0,
            explanation: '动态规划通过将问题分解为重叠子问题，并存储子问题的解（记忆化），避免重复计算。'
          }
        ]
      },
      'ch14-l01': {
        lessonTitle: '数组与哈希表',
        questions: [
          {
            type: 'choice',
            question: '数组访问第 i 个元素的时间复杂度是？',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
            answer: 0,
            explanation: '数组支持随机访问，通过索引直接计算内存地址，时间复杂度 O(1)。'
          },
          {
            type: 'choice',
            question: '哈希表的平均查找时间复杂度是？',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
            answer: 0,
            explanation: '哈希表通过哈希函数直接计算存储位置，平均时间复杂度为 O(1)。'
          },
          {
            type: 'fill',
            question: '两数之和问题：给定数组和目标值，找出和为目标值的两个数。使用____可以 O(n) 解决。',
            answer: '哈希表，hash map,字典，hash',
            explanation: '使用哈希表存储每个数的索引，遍历时检查 target - num 是否在哈希表中，时间复杂度 O(n)。'
          }
        ]
      }
    };
  },

  // 获取某课的练习题
  getQuiz(lessonId) {
    if (!this.quizzes || Object.keys(this.quizzes).length === 0) {
      this.init();
    }
    return this.quizzes[lessonId] || null;
  },

  // 检查答案是否正确
  checkAnswer(lessonId, questionIndex, userAnswer) {
    const quiz = this.getQuiz(lessonId);
    if (!quiz || !quiz.questions[questionIndex]) return null;

    const question = quiz.questions[questionIndex];
    let isCorrect = false;

    if (question.type === 'choice') {
      isCorrect = userAnswer === question.answer;
    } else if (question.type === 'fill') {
      // 支持多个答案（用逗号分隔）
      const validAnswers = question.answer.split(',').map(a => a.trim().toLowerCase());
      isCorrect = validAnswers.includes(userAnswer.toLowerCase().trim());
    }

    return {
      correct: isCorrect,
      explanation: question.explanation,
      correctAnswer: question.type === 'choice'
        ? question.options[question.answer]
        : question.answer
    };
  },

  // 获取题目数量
  getQuestionCount(lessonId) {
    const quiz = this.getQuiz(lessonId);
    return quiz ? quiz.questions.length : 0;
  }
};

// 导出到全局
window.QuizData = QuizData;
