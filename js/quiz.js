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

      // ============ 第 3 章：微积分 ============
      'ch03-l01': {
        lessonTitle: '微分学',
        questions: [
          {
            type: 'choice',
            question: '导数的几何意义是什么？',
            options: [
              '曲线的长度',
              '曲线在某点的切线斜率',
              '曲线下的面积',
              '曲线的曲率'
            ],
            answer: 1,
            explanation: '导数表示函数在某点的瞬时变化率，几何上就是该点切线的斜率。'
          },
          {
            type: 'fill',
            question: '常数函数的导数等于____。',
            answer: '0',
            explanation: '常数函数不随自变量变化，变化率为 0，所以导数为 0。'
          },
          {
            type: 'choice',
            question: '函数 f(x) = x² 的导数是？',
            options: ['x', '2x', 'x²', '2x²'],
            answer: 1,
            explanation: '根据幂函数求导法则：(xⁿ)\' = nxⁿ⁻¹，所以 (x²)\' = 2x。'
          },
          {
            type: 'choice',
            question: '链式法则用于求____的导数。',
            options: [
              '两个函数的和',
              '两个函数的积',
              '复合函数',
              '两个函数的商'
            ],
            answer: 2,
            explanation: '链式法则：(f(g(x)))\' = f\'(g(x)) · g\'(x)，用于复合函数求导。'
          }
        ]
      },
      'ch03-l02': {
        lessonTitle: '积分学',
        questions: [
          {
            type: 'choice',
            question: '不定积分的结果是什么？',
            options: [
              '一个数值',
              '一个函数族',
              '一个导数',
              '一个极限'
            ],
            answer: 1,
            explanation: '不定积分是求原函数的过程，结果是带有任意常数 C 的函数族。'
          },
          {
            type: 'fill',
            question: '微积分基本定理将____和____联系起来。',
            answer: '微分，积分，求导，积分',
            explanation: '微积分基本定理揭示了微分和积分是互逆运算。'
          },
          {
            type: 'choice',
            question: '∫x dx 的结果是？',
            options: ['x²', 'x²/2', 'x²/2 + C', '2x'],
            answer: 2,
            explanation: '根据幂函数积分法则：∫xⁿ dx = xⁿ⁺¹/(n+1) + C，所以∫x dx = x²/2 + C。'
          }
        ]
      },
      'ch03-l03': {
        lessonTitle: '多变量微积分',
        questions: [
          {
            type: 'choice',
            question: '偏导数是针对____变量求导。',
            options: [
              '所有',
              '其中一个',
              '因变量',
              '参数'
            ],
            answer: 1,
            explanation: '偏导数是保持其他变量不变，只对其中一个自变量求导。'
          },
          {
            type: 'choice',
            question: '梯度是一个____量。',
            options: ['标', '向', '矩', '张'],
            answer: 1,
            explanation: '梯度是向量，指向函数增长最快的方向，大小是该方向的变化率。'
          },
          {
            type: 'fill',
            question: '梯度的符号是____（用数学符号表示）。',
            answer: '∇',
            explanation: '梯度用 Nabla 算子∇表示，∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z)。'
          }
        ]
      },
      'ch03-l04': {
        lessonTitle: '函数逼近',
        questions: [
          {
            type: 'choice',
            question: '泰勒级数在某点展开是用____来逼近函数。',
            options: [
              '直线',
              '多项式',
              '指数函数',
              '三角函数'
            ],
            answer: 1,
            explanation: '泰勒级数用无穷多项式来逼近函数，项数越多逼近越精确。'
          },
          {
            type: 'choice',
            question: '一阶泰勒展开就是函数的____近似。',
            options: ['常数', '线性', '二次', '指数'],
            answer: 1,
            explanation: '一阶泰勒展开 f(x) ≈ f(a) + f\'(a)(x-a) 是线性近似。'
          }
        ]
      },
      'ch03-l05': {
        lessonTitle: '优化与梯度下降',
        questions: [
          {
            type: 'choice',
            question: '梯度下降法用于求函数的____值。',
            options: ['最大', '最小', '平均', '中位'],
            answer: 1,
            explanation: '梯度下降沿负梯度方向迭代，寻找函数的局部最小值。'
          },
          {
            type: 'fill',
            question: '学习率太大会导致梯度下降____。',
            answer: '发散， overshoot,超过，错过',
            explanation: '学习率过大会步长过大，可能跳过最优点甚至发散。'
          },
          {
            type: 'choice',
            question: '随机梯度下降（SGD）每次更新使用____样本。',
            options: [
              '全部',
              '一个或一小批',
              '一半',
              '固定的 100 个'
            ],
            answer: 1,
            explanation: 'SGD 每次更新只用一个或一小批样本，速度快但波动大。'
          }
        ]
      },

      // ============ 第 4 章：统计学 ============
      'ch04-l01': {
        lessonTitle: '统计学基础',
        questions: [
          {
            type: 'choice',
            question: '描述统计学的主要目的是？',
            options: [
              '从样本推断总体',
              '总结和描述数据特征',
              '预测未来趋势',
              '检验假设'
            ],
            answer: 1,
            explanation: '描述统计学用于总结和展示数据的特征，如均值、中位数、标准差等。'
          },
          {
            type: 'choice',
            question: '以下哪个是集中趋势的度量？',
            options: ['方差', '标准差', '均值', '极差'],
            answer: 2,
            explanation: '均值（平均数）是集中趋势的度量，方差和标准差是离散程度的度量。'
          }
        ]
      },
      'ch04-l02': {
        lessonTitle: '统计度量',
        questions: [
          {
            type: 'choice',
            question: '方差的单位是原始数据单位的？',
            options: ['相同', '平方', '开方', '无关'],
            answer: 1,
            explanation: '方差是各数据与均值差的平方的平均，单位是原始单位的平方。'
          },
          {
            type: 'fill',
            question: '标准差是方差的____。',
            answer: '平方根，算术平方根',
            explanation: '标准差 = √方差，它将单位恢复到与原始数据相同。'
          },
          {
            type: 'choice',
            question: '四分位距（IQR）是？',
            options: [
              '最大值减最小值',
              'Q3 - Q1',
              'Q2 - Q1',
              'Q3 - Q2'
            ],
            answer: 1,
            explanation: 'IQR = Q3 - Q1，表示中间 50% 数据的分布范围。'
          }
        ]
      },
      'ch04-l03': {
        lessonTitle: '抽样分布',
        questions: [
          {
            type: 'choice',
            question: '中心极限定理指出，大样本下样本均值的分布趋近于？',
            options: [
              '均匀分布',
              '二项分布',
              '正态分布',
              '泊松分布'
            ],
            answer: 2,
            explanation: '中心极限定理：无论总体分布如何，大样本下样本均值的分布趋近正态分布。'
          },
          {
            type: 'fill',
            question: '样本量越大，样本均值的标准误越____。',
            answer: '小',
            explanation: '标准误 = σ/√n，样本量 n 越大，标准误越小。'
          }
        ]
      },
      'ch04-l04': {
        lessonTitle: '假设检验',
        questions: [
          {
            type: 'choice',
            question: 'p 值小于显著性水平α时，我们____原假设。',
            options: ['接受', '拒绝', '不拒绝', '修改'],
            answer: 1,
            explanation: 'p < α 时拒绝原假设，认为结果有统计学意义。'
          },
          {
            type: 'choice',
            question: '第一类错误是？',
            options: [
              '拒绝了正确的原假设',
              '接受了错误的原假设',
              '样本量不足',
              '计算错误'
            ],
            answer: 0,
            explanation: '第一类错误（假阳性）：原假设为真时错误地拒绝了它。'
          }
        ]
      },
      'ch04-l05': {
        lessonTitle: '统计推断',
        questions: [
          {
            type: 'choice',
            question: '置信区间的 95% 置信水平意味着？',
            options: [
              '参数有 95% 概率落在区间内',
              '重复抽样 100 次，约 95 次构造的区间包含参数',
              '区间宽度是 95%',
              '误差是 5%'
            ],
            answer: 1,
            explanation: '置信水平是频率学派概念：重复抽样下区间包含参数的比例。'
          },
          {
            type: 'fill',
            question: '点估计是用____个值来估计参数。',
            answer: '一，单',
            explanation: '点估计用一个具体数值（如样本均值）估计总体参数。'
          }
        ]
      },

      // ============ 第 5 章：概率论 ============
      'ch05-l01': {
        lessonTitle: '计数原理',
        questions: [
          {
            type: 'choice',
            question: '乘法原理适用于____的事件。',
            options: [
              '互斥',
              '独立且分步',
              '对立',
              '相关'
            ],
            answer: 1,
            explanation: '乘法原理：完成一件事需要 n 个步骤，每步有 mᵢ 种方法，则总方法数为 m₁×m₂×...×mₙ。'
          },
          {
            type: 'choice',
            question: '从 5 个不同元素中选 3 个的排列数是？',
            options: ['10', '60', '20', '125'],
            answer: 1,
            explanation: 'P(5,3) = 5!/(5-3)! = 5×4×3 = 60。排列考虑顺序。'
          },
          {
            type: 'fill',
            question: '组合____顺序（填"考虑"或"不考虑"）。',
            answer: '不考虑',
            explanation: '组合不考虑顺序，C(n,r) = n!/[r!(n-r)!]。'
          }
        ]
      },
      'ch05-l02': {
        lessonTitle: '概率概念',
        questions: [
          {
            type: 'choice',
            question: '概率的取值范围是？',
            options: ['(-∞, +∞)', '[0, 1]', '(0, 1)', '[-1, 1]'],
            answer: 1,
            explanation: '概率是介于 0 和 1 之间的数，0 表示不可能事件，1 表示必然事件。'
          },
          {
            type: 'choice',
            question: '两个互斥事件 A 和 B，P(A∪B) = ？',
            options: [
              'P(A) × P(B)',
              'P(A) + P(B)',
              'P(A) - P(B)',
              'P(A) / P(B)'
            ],
            answer: 1,
            explanation: '互斥事件的加法法则：P(A∪B) = P(A) + P(B)。'
          }
        ]
      },
      'ch05-l03': {
        lessonTitle: '概率分布',
        questions: [
          {
            type: 'choice',
            question: '正态分布的 shape 由____参数决定。',
            options: ['μ', 'σ', 'μ和σ', 'n'],
            answer: 2,
            explanation: '正态分布 N(μ, σ²) 由均值μ（位置）和标准差σ（形状）决定。'
          },
          {
            type: 'fill',
            question: '二项分布记作 B(n, p)，其中 n 表示____。',
            answer: '试验次数，n 次试验',
            explanation: '二项分布描述 n 次独立伯努利试验中成功的次数。'
          }
        ]
      },
      'ch05-l04': {
        lessonTitle: '贝叶斯方法',
        questions: [
          {
            type: 'choice',
            question: '贝叶斯定理的公式是？',
            options: [
              'P(A|B) = P(B|A)P(A) / P(B)',
              'P(A|B) = P(A)P(B) / P(B|A)',
              'P(A|B) = P(B|A) / P(A)',
              'P(A|B) = P(A) / P(B)'
            ],
            answer: 0,
            explanation: '贝叶斯定理：P(A|B) = P(B|A)P(A) / P(B)，用于更新后验概率。'
          },
          {
            type: 'fill',
            question: 'P(A) 在贝叶斯定理中称为____概率。',
            answer: '先验',
            explanation: 'P(A) 是先验概率（更新前的信念），P(A|B) 是后验概率（更新后的信念）。'
          }
        ]
      },
      'ch05-l05': {
        lessonTitle: '信息论基础',
        questions: [
          {
            type: 'choice',
            question: '信息熵衡量的是？',
            options: [
              '信息的价值',
              '信息的不确定性',
              '信息的长度',
              '信息的传输速度'
            ],
            answer: 1,
            explanation: '熵 H(X) 衡量随机变量的不确定性，熵越大不确定性越高。'
          },
          {
            type: 'choice',
            question: '均匀分布的熵是？',
            options: ['最小', '最大', '0', '无法确定'],
            answer: 1,
            explanation: '在所有可能的分布中，均匀分布的熵最大，表示最大的不确定性。'
          }
        ]
      },

      // ============ 第 6 章：机器学习 ============
      'ch06-l01': {
        lessonTitle: '经典机器学习',
        questions: [
          {
            type: 'choice',
            question: '监督学习需要____数据。',
            options: [
              '无标签',
              '有标签',
              '部分标签',
              '不需要标签'
            ],
            answer: 1,
            explanation: '监督学习使用有标签的数据进行训练，学习输入到输出的映射。'
          },
          {
            type: 'choice',
            question: '以下哪个是分类算法？',
            options: ['线性回归', 'K 均值', '逻辑回归', 'PCA'],
            answer: 2,
            explanation: '逻辑回归用于分类，线性回归用于回归，K 均值和 PCA 是无监督学习。'
          },
          {
            type: 'fill',
            question: '过拟合是指模型在训练集上表现____，在测试集上表现____。',
            answer: '好，差，优秀，不好',
            explanation: '过拟合：模型过于复杂，记住了训练数据的噪声，泛化能力差。'
          }
        ]
      },
      'ch06-l02': {
        lessonTitle: '梯度机器学习',
        questions: [
          {
            type: 'choice',
            question: '反向传播用于计算？',
            options: [
              '前向传播的输出',
              '损失函数的梯度',
              '输入的梯度',
              '激活函数的导数'
            ],
            answer: 1,
            explanation: '反向传播通过链式法则计算损失函数对每个参数的梯度。'
          },
          {
            type: 'choice',
            question: '学习率过大可能导致？',
            options: ['收敛过快', '发散', '陷入局部最优', '梯度消失'],
            answer: 1,
            explanation: '学习率过大会导致梯度下降步长过大，跳过最优解甚至发散。'
          }
        ]
      },
      'ch06-l03': {
        lessonTitle: '深度学习',
        questions: [
          {
            type: 'choice',
            question: 'ReLU 激活函数的输出范围是？',
            options: ['(0, 1)', '[0, +∞)', '(-∞, +∞)', '[-1, 1]'],
            answer: 1,
            explanation: 'ReLU(x) = max(0, x)，输出范围是 [0, +∞)。'
          },
          {
            type: 'fill',
            question: '卷积神经网络中，____层用于降采样。',
            answer: '池化，pooling, 下采样',
            explanation: '池化层（如最大池化）用于减少特征图的空间尺寸。'
          }
        ]
      },
      'ch06-l04': {
        lessonTitle: '强化学习',
        questions: [
          {
            type: 'choice',
            question: '强化学习中，agent 通过与环境交互获得？',
            options: ['标签', '奖励', '梯度', '损失'],
            answer: 1,
            explanation: '强化学习中 agent 根据行动获得奖励信号，学习最大化累积奖励的策略。'
          },
          {
            type: 'choice',
            question: 'Q-learning 是一种____学习算法。',
            options: [
              '基于策略',
              '基于价值',
              '基于模型',
              '监督'
            ],
            answer: 1,
            explanation: 'Q-learning 学习状态 - 动作价值函数 Q(s,a)，属于基于价值的方法。'
          }
        ]
      },
      'ch06-l05': {
        lessonTitle: '分布式深度学习',
        questions: [
          {
            type: 'choice',
            question: '数据并行是将____分配到多个设备。',
            options: [
              '模型参数',
              '训练数据',
              '损失函数',
              '优化器'
            ],
            answer: 1,
            explanation: '数据并行将训练数据分片到多个设备，每个设备有完整的模型副本。'
          },
          {
            type: 'fill',
            question: '模型并行用于解决____不足的问题。',
            answer: '显存，内存，GPU 内存',
            explanation: '模型并行将大模型分割到多个设备，解决单个设备显存不足的问题。'
          }
        ]
      },

      // ============ 第 7 章：计算语言学 ============
      'ch07-l01': {
        lessonTitle: '语言学基础',
        questions: [
          {
            type: 'choice',
            question: '语法学研究的是？',
            options: [
              '词的意义',
              '句子的结构',
              '语言的使用',
              '语音的规律'
            ],
            answer: 1,
            explanation: '语法学研究句子的结构和成分组合规则。'
          },
          {
            type: 'choice',
            question: '语用学研究的是？',
            options: [
              '词的结构',
              '句子的真假',
              '语境中的语言使用',
              '语言的进化'
            ],
            answer: 2,
            explanation: '语用学研究语言在具体语境中的使用和含义。'
          }
        ]
      },
      'ch07-l02': {
        lessonTitle: '文本处理与经典 NLP',
        questions: [
          {
            type: 'choice',
            question: '分词（tokenization）是将文本分割成____。',
            options: [
              '句子',
              '词或子词单元',
              '段落',
              '字符'
            ],
            answer: 1,
            explanation: '分词将连续文本分割成词、子词或字符等处理单元。'
          },
          {
            type: 'fill',
            question: '词干提取（stemming）是将词还原为____形式。',
            answer: '词干，基本，原型',
            explanation: '词干提取去除词缀得到词干，如 "running" → "run"。'
          }
        ]
      },
      'ch07-l03': {
        lessonTitle: '词嵌入与序列模型',
        questions: [
          {
            type: 'choice',
            question: 'Word2Vec 的核心思想是？',
            options: [
              '词的共现信息',
              '词的拼写',
              '词的发音',
              '词的词性'
            ],
            answer: 0,
            explanation: 'Word2Vec 通过词的上下文（共现）学习词向量，相似含义的词向量接近。'
          },
          {
            type: 'choice',
            question: 'RNN 处理序列数据时的主要问题是？',
            options: [
              '计算太慢',
              '长期依赖问题',
              '参数太多',
              '无法并行'
            ],
            answer: 1,
            explanation: 'RNN 在长序列上容易出现梯度消失/爆炸，难以学习长期依赖。'
          }
        ]
      },
      'ch07-l04': {
        lessonTitle: 'Transformer 与语言模型',
        questions: [
          {
            type: 'choice',
            question: 'Transformer 的核心机制是？',
            options: [
              '卷积',
              '循环',
              '自注意力',
              '池化'
            ],
            answer: 2,
            explanation: 'Transformer 完全基于自注意力机制，不再使用 RNN 或 CNN。'
          },
          {
            type: 'fill',
            question: 'BERT 是一个____向语言模型（填"单"或"双"）。',
            answer: '双',
            explanation: 'BERT 使用双向 Transformer 编码器，同时利用左右上下文信息。'
          }
        ]
      },
      'ch07-l05': {
        lessonTitle: '高级文本生成',
        questions: [
          {
            type: 'choice',
            question: 'GPT 系列是____架构的语言模型。',
            options: [
              '编码器',
              '解码器',
              '编码器 - 解码器',
              '双向'
            ],
            answer: 1,
            explanation: 'GPT 使用 Transformer 解码器架构，是单向（从左到右）的语言模型。'
          },
          {
            type: 'choice',
            question: '温度参数（temperature）用于控制生成文本的？',
            options: [
              '长度',
              '多样性',
              '质量',
              '速度'
            ],
            answer: 1,
            explanation: '温度越高生成越随机多样，温度越低生成越确定保守。'
          }
        ]
      },

      // ============ 第 8 章：计算机视觉 ============
      'ch08-l01': {
        lessonTitle: '图像基础',
        questions: [
          {
            type: 'choice',
            question: 'RGB 图像的三个通道分别代表？',
            options: [
              '红、绿、蓝',
              '黄、绿、蓝',
              '红、黄、蓝',
              '亮度、色度、饱和度'
            ],
            answer: 0,
            explanation: 'RGB 三原色是红（Red）、绿（Green）、蓝（Blue）。'
          },
          {
            type: 'choice',
            question: '卷积操作在图像处理中用于？',
            options: [
              '放大图像',
              '提取特征',
              '压缩图像',
              '变换颜色'
            ],
            answer: 1,
            explanation: '卷积核滑动扫描图像，提取边缘、纹理等特征。'
          }
        ]
      },
      'ch08-l02': {
        lessonTitle: '卷积网络',
        questions: [
          {
            type: 'choice',
            question: 'CNN 中池化层的主要作用是？',
            options: [
              '增加参数',
              '降采样减少计算量',
              '增加非线性',
              '规范化输出'
            ],
            answer: 1,
            explanation: '池化层（如最大池化）减少特征图尺寸，降低计算量和参数数量。'
          },
          {
            type: 'fill',
            question: 'ResNet 的核心创新是____连接。',
            answer: '残差，跳跃，shortcut',
            explanation: '残差连接（跳跃连接）解决了深层网络的梯度消失问题。'
          }
        ]
      },
      'ch08-l03': {
        lessonTitle: '目标检测与分割',
        questions: [
          {
            type: 'choice',
            question: 'YOLO 是____检测算法。',
            options: [
              '两阶段',
              '单阶段',
              '三阶段',
              '多阶段'
            ],
            answer: 1,
            explanation: 'YOLO（You Only Look Once）是单阶段检测算法，速度快。'
          },
          {
            type: 'choice',
            question: '语义分割与实例分割的区别是？',
            options: [
              '精度不同',
              '是否区分同一类别的不同实例',
              '速度不同',
              '网络结构不同'
            ],
            answer: 1,
            explanation: '语义分割只分类像素，实例分割还要区分同一类别的不同个体。'
          }
        ]
      },
      'ch08-l04': {
        lessonTitle: 'Vision Transformer 与生成',
        questions: [
          {
            type: 'choice',
            question: 'ViT 将图像分割成____后输入 Transformer。',
            options: [
              '像素',
              '补丁（patches）',
              '区域',
              '特征'
            ],
            answer: 1,
            explanation: 'ViT 将图像分成固定大小的补丁，线性嵌入后作为 token 序列。'
          },
          {
            type: 'fill',
            question: '扩散模型的灵感来自____过程。',
            answer: '扩散，热力学扩散',
            explanation: '扩散模型模拟热力学扩散过程，逐步加噪再去噪生成图像。'
          }
        ]
      },
      'ch08-l05': {
        lessonTitle: '视频与 3D 视觉',
        questions: [
          {
            type: 'choice',
            question: '光流（optical flow）描述的是？',
            options: [
              '图像的颜色变化',
              '像素的运动矢量',
              '摄像头的移动',
              '物体的形变'
            ],
            answer: 1,
            explanation: '光流是相邻帧间像素的运动矢量场。'
          },
          {
            type: 'choice',
            question: 'NeRF 用于从 2D 图像重建____。',
            options: [
              '2D 图像',
              '3D 场景',
              '视频',
              '深度图'
            ],
            answer: 1,
            explanation: 'NeRF（神经辐射场）从多视角 2D 图像重建 3D 场景表示。'
          }
        ]
      },

      // ============ 第 9 章：音频与语音 ============
      'ch09-l01': {
        lessonTitle: '数字信号处理',
        questions: [
          {
            type: 'choice',
            question: '奈奎斯特采样定理指出采样频率至少是信号最高频率的____倍。',
            options: ['1', '2', '3', '4'],
            answer: 1,
            explanation: '奈奎斯特定理：采样频率 ≥ 2×信号最高频率，否则会发生混叠。'
          },
          {
            type: 'fill',
            question: 'FFT 是____的缩写。',
            answer: '快速傅里叶变换，Fast Fourier Transform',
            explanation: 'FFT 是快速傅里叶变换，将时域信号转换到频域。'
          }
        ]
      },
      'ch09-l02': {
        lessonTitle: '自动语音识别',
        questions: [
          {
            type: 'choice',
            question: 'MFCC 特征用于表示？',
            options: [
              '图像的纹理',
              '音频的频谱特征',
              '文本的语义',
              '视频的运动'
            ],
            answer: 1,
            explanation: 'MFCC（梅尔频率倒谱系数）是语音识别中常用的音频特征。'
          },
          {
            type: 'choice',
            question: 'CTC 损失用于解决____问题。',
            options: [
              '分类',
              '序列对齐',
              '聚类',
              '降维'
            ],
            answer: 1,
            explanation: 'CTC（连接主义时序分类）解决输入输出长度不同的对齐问题。'
          }
        ]
      },
      'ch09-l03': {
        lessonTitle: '文本转语音',
        questions: [
          {
            type: 'choice',
            question: 'Tacotron 是____模型。',
            options: [
              '端到端 TTS',
              'ASR',
              '语音增强',
              '说话人识别'
            ],
            answer: 0,
            explanation: 'Tacotron 是端到端的文本转语音（TTS）模型。'
          },
          {
            type: 'fill',
            question: 'WaveNet 使用____卷积生成音频波形。',
            answer: '膨胀，dilated,空洞',
            explanation: 'WaveNet 使用膨胀因果卷积，感受野随层数指数增长。'
          }
        ]
      },
      'ch09-l04': {
        lessonTitle: '说话人与语音分析',
        questions: [
          {
            type: 'choice',
            question: '说话人验证是____任务。',
            options: [
              '一对多',
              '一对一',
              '多对多',
              '聚类'
            ],
            answer: 1,
            explanation: '说话人验证是 1:1 匹配，判断输入语音是否是特定说话人。'
          },
          {
            type: 'choice',
            question: '说话人识别的嵌入向量叫做？',
            options: [
              'Word2Vec',
              'x-vector',
              'BERT',
              'MFCC'
            ],
            answer: 1,
            explanation: 'x-vector 是说话人识别中常用的深度嵌入向量。'
          }
        ]
      },
      'ch09-l05': {
        lessonTitle: '声源分离与噪声',
        questions: [
          {
            type: 'choice',
            question: '鸡尾酒会问题是指____场景。',
            options: [
              '语音识别',
              '多说话人分离',
              '语音合成',
              '噪声抑制'
            ],
            answer: 1,
            explanation: '鸡尾酒会问题是在多人同时说话的环境中分离目标语音。'
          },
          {
            type: 'fill',
            question: '波束形成使用____阵列来增强目标方向的声音。',
            answer: '麦克风，microphone',
            explanation: '麦克风阵列通过波束形成技术增强特定方向的声音，抑制其他方向。'
          }
        ]
      },

      // ============ 第 10 章：多模态学习 ============
      'ch10-l01': {
        lessonTitle: '多模态表示',
        questions: [
          {
            type: 'choice',
            question: '多模态学习处理____种模态的数据。',
            options: ['1', '2 种或以上', '3 种', '4 种以上'],
            answer: 1,
            explanation: '多模态学习处理两种或以上不同类型的数据（如文本、图像、音频）。'
          },
          {
            type: 'choice',
            question: '对比学习用于学习____的表示。',
            options: [
              '模态内',
              '跨模态共享',
              '单一模态',
              '独立'
            ],
            answer: 1,
            explanation: '对比学习将不同模态的相同语义样本拉近，学习共享表示空间。'
          }
        ]
      },
      'ch10-l02': {
        lessonTitle: '视觉语言模型',
        questions: [
          {
            type: 'choice',
            question: 'CLIP 模型训练使用____数据。',
            options: [
              '图像 - 文本对',
              '纯文本',
              '纯图像',
              '视频'
            ],
            answer: 0,
            explanation: 'CLIP 使用 4 亿图像 - 文本对进行对比学习。'
          },
          {
            type: 'fill',
            question: 'VLM 是____的缩写。',
            answer: 'Vision Language Model,视觉语言模型',
            explanation: 'VLM 是视觉语言模型，能够理解和推理图像与文本的关系。'
          }
        ]
      },
      'ch10-l03': {
        lessonTitle: '图像与视频标记化',
        questions: [
          {
            type: 'choice',
            question: 'VQ-VAE 中的 VQ 代表？',
            options: [
              'Vector Quantization',
              'Visual Quality',
              'Variable Quantity',
              'Video Quality'
            ],
            answer: 0,
            explanation: 'VQ-VAE 使用向量量化将连续潜在表示离散化。'
          },
          {
            type: 'choice',
            question: '图像 token 化将图像转换为____序列。',
            options: [
              '像素',
              '离散 token',
              '特征图',
              '补丁'
            ],
            answer: 1,
            explanation: '图像 token 化将图像转换为离散 token 序列，可用语言模型处理。'
          }
        ]
      },
      'ch10-l04': {
        lessonTitle: '跨模态生成',
        questions: [
          {
            type: 'choice',
            question: 'DALL-E 是____模型。',
            options: [
              '文本生成图像',
              '图像生成文本',
              '文本生成视频',
              '图像生成音频'
            ],
            answer: 0,
            explanation: 'DALL-E 是根据文本描述生成图像的模型。'
          },
          {
            type: 'fill',
            question: 'Stable Diffusion 是在____空间进行扩散的模型。',
            answer: '潜在，latent',
            explanation: 'Stable Diffusion 在潜在空间（latent space）而非像素空间进行扩散，效率更高。'
          }
        ]
      },
      'ch10-l05': {
        lessonTitle: '统一多模态架构',
        questions: [
          {
            type: 'choice',
            question: 'Flamingo 模型的特点是？',
            options: [
              '仅处理文本',
              '仅处理图像',
              '穿插视觉 - 文本序列处理',
              '分离的视觉和文本编码器'
            ],
            answer: 2,
            explanation: 'Flamingo 处理穿插的视觉 - 文本 token 序列，统一多模态输入。'
          },
          {
            type: 'choice',
            question: 'GATO 是一个____模型。',
            options: [
              '专用',
              '通用',
              '视觉专用',
              '语言专用'
            ],
            answer: 1,
            explanation: 'GATO 是 DeepMind 的多模态通用模型，能处理多种任务。'
          }
        ]
      },

      // ============ 第 11 章：自主系统 ============
      'ch11-l01': {
        lessonTitle: '感知',
        questions: [
          {
            type: 'choice',
            question: 'SLAM 是____的缩写。',
            options: [
              'Simultaneous Localization and Mapping',
              'System for Location and Movement',
              'Sensor for Land and Map',
              'Spatial Learning and Mapping'
            ],
            answer: 0,
            explanation: 'SLAM 是同时定位与建图，用于机器人在未知环境中构建地图并定位自己。'
          },
          {
            type: 'choice',
            question: 'LiDAR 使用____进行测距。',
            options: [
              '无线电波',
              '激光',
              '超声波',
              '摄像头'
            ],
            answer: 1,
            explanation: 'LiDAR（激光雷达）使用激光脉冲测量距离。'
          }
        ]
      },
      'ch11-l02': {
        lessonTitle: '机器人学习',
        questions: [
          {
            type: 'choice',
            question: '模仿学习是从____中学习策略。',
            options: [
              '奖励信号',
              '专家示范',
              '试错',
              '模型预测'
            ],
            answer: 1,
            explanation: '模仿学习通过观察专家示范来学习行为策略。'
          },
          {
            type: 'fill',
            question: '逆向强化学习从专家行为中推断____函数。',
            answer: '奖励，reward',
            explanation: '逆向强化学习假设专家行为是最优的，从中推断隐含的奖励函数。'
          }
        ]
      },
      'ch11-l03': {
        lessonTitle: '视觉-语言-动作模型',
        questions: [
          {
            type: 'choice',
            question: 'VLA 模型输出的是？',
            options: [
              '文本',
              '图像',
              '动作指令',
              '奖励'
            ],
            answer: 2,
            explanation: 'VLA（视觉 - 语言 - 动作）模型根据视觉输入和语言指令输出机器人动作。'
          },
          {
            type: 'choice',
            question: 'RT-2 是什么模型？',
            options: [
              '纯语言模型',
              '视觉 - 语言 - 动作模型',
              '纯视觉模型',
              '规划模型'
            ],
            answer: 1,
            explanation: 'RT-2 是 Google 的视觉 - 语言 - 动作模型，直接输出机器人控制指令。'
          }
        ]
      },
      'ch11-l04': {
        lessonTitle: '自动驾驶',
        questions: [
          {
            type: 'choice',
            question: '自动驾驶的 L4 级别是？',
            options: [
              '完全自动化',
              '高度自动化',
              '部分自动化',
              '辅助驾驶'
            ],
            answer: 1,
            explanation: 'L4 是高度自动化，在特定场景下无需人工干预。'
          },
          {
            type: 'fill',
            question: '自动驾驶感知系统的三个主要传感器是摄像头、____和 LiDAR。',
            answer: '雷达，millimeter wave radar，毫米波雷达',
            explanation: '自动驾驶通常使用摄像头、毫米波雷达和 LiDAR 的组合。'
          }
        ]
      },
      'ch11-l05': {
        lessonTitle: '空间与极端机器人',
        questions: [
          {
            type: 'choice',
            question: '太空机器人面临的主要挑战是？',
            options: [
              '高温',
              '辐射和通信延迟',
              '重力过大',
              '氧气不足'
            ],
            answer: 1,
            explanation: '太空环境有强辐射和长通信延迟，对机器人系统是巨大挑战。'
          },
          {
            type: 'choice',
            question: '火星车的能源主要来自？',
            options: [
              '电池',
              '太阳能或核能',
              '燃油',
              '风能'
            ],
            answer: 1,
            explanation: '火星车使用太阳能电池板或放射性同位素热电发电机（RTG）。'
          }
        ]
      },

      // ============ 第 12 章：图神经网络 ============
      'ch12-l01': {
        lessonTitle: '几何深度学习',
        questions: [
          {
            type: 'choice',
            question: '几何深度学习处理的数据具有____结构。',
            options: [
              '欧几里得',
              '非欧几里得',
              '线性',
              '平面'
            ],
            answer: 1,
            explanation: '几何深度学习处理图、流形等非欧几里得数据。'
          },
          {
            type: 'choice',
            question: '等变神经网络保持____性质。',
            options: [
              '平移',
              '旋转和平移',
              '缩放',
              '反射'
            ],
            answer: 1,
            explanation: '等变网络保证输入变换时输出相应变换，保持对称性。'
          }
        ]
      },
      'ch12-l02': {
        lessonTitle: '图论',
        questions: [
          {
            type: 'choice',
            question: '图的度数是指？',
            options: [
              '节点的数量',
              '边的数量',
              '与节点相连的边数',
              '图的距离'
            ],
            answer: 2,
            explanation: '节点的度数是与其相连的边的数量。'
          },
          {
            type: 'fill',
            question: '无向图中，所有节点的度数之和等于边数的____倍。',
            answer: '2',
            explanation: '每条边贡献 2 度（两个端点各 1 度），所以度数和 = 2×边数。'
          }
        ]
      },
      'ch12-l03': {
        lessonTitle: '图神经网络',
        questions: [
          {
            type: 'choice',
            question: 'GNN 中的消息传递是指？',
            options: [
              '节点间发送数据',
              '聚合邻居信息',
              '更新边权重',
              '传输梯度'
            ],
            answer: 1,
            explanation: '消息传递是节点聚合邻居信息来更新自己的表示。'
          },
          {
            type: 'choice',
            question: 'GraphSAGE 使用____方式聚合邻居信息。',
            options: [
              '只有求和',
              '采样 + 聚合函数',
              '注意力',
              '卷积'
            ],
            answer: 1,
            explanation: 'GraphSAGE 采样固定数量的邻居，使用聚合函数（如 mean/max/LSTM）。'
          }
        ]
      },
      'ch12-l04': {
        lessonTitle: '图注意力网络',
        questions: [
          {
            type: 'choice',
            question: 'GAT 使用____机制来加权邻居。',
            options: [
              '平均',
              '最大池化',
              '注意力',
              '卷积'
            ],
            answer: 2,
            explanation: 'GAT（图注意力网络）使用自注意力机制学习邻居的重要性权重。'
          },
          {
            type: 'fill',
            question: '多头注意力可以提高 GAT 的____能力。',
            answer: '表达，表征，建模',
            explanation: '多头注意力允许模型关注不同子空间的信息，增强表达能力。'
          }
        ]
      },
      'ch12-l05': {
        lessonTitle: '3D 图等变网络',
        questions: [
          {
            type: 'choice',
            question: '3D 图网络主要用于？',
            options: [
              '社交网络',
              '分子性质预测',
              '文本分类',
              '图像分割'
            ],
            answer: 1,
            explanation: '3D 图等变网络用于分子建模、蛋白质结构预测等 3D 结构数据。'
          },
          {
            type: 'choice',
            question: '等变性保证网络对 3D____保持不变。',
            options: [
              '大小',
              '旋转和平移',
              '颜色',
              '材质'
            ],
            answer: 1,
            explanation: '3D 等变网络对旋转和平移具有等变性，输出随输入变换相应变换。'
          }
        ]
      },

      // ============ 第 13 章：计算与操作系统 ============
      'ch13-l01': {
        lessonTitle: '离散数学',
        questions: [
          {
            type: 'choice',
            question: '命题逻辑中，∧表示____运算。',
            options: ['或', '与', '非', '蕴含'],
            answer: 1,
            explanation: '∧是逻辑与（AND），∨是逻辑或（OR），¬是逻辑非（NOT）。'
          },
          {
            type: 'choice',
            question: '集合的交集用符号____表示。',
            options: ['∪', '∩', '⊆', '∈'],
            answer: 1,
            explanation: '∩表示交集，∪表示并集，⊆表示子集，∈表示属于。'
          }
        ]
      },
      'ch13-l02': {
        lessonTitle: '计算机架构',
        questions: [
          {
            type: 'choice',
            question: 'CPU 的主要组成部分是？',
            options: [
              'ALU、控制单元、寄存器',
              '内存、硬盘、显卡',
              '输入、输出、存储',
              '总线、接口、电源'
            ],
            answer: 0,
            explanation: 'CPU 由算术逻辑单元（ALU）、控制单元和寄存器组成。'
          },
          {
            type: 'fill',
            question: 'RISC 是____指令集架构。',
            answer: '精简，Reduced Instruction Set',
            explanation: 'RISC 是精简指令集计算机，指令少且简单。'
          }
        ]
      },
      'ch13-l03': {
        lessonTitle: '操作系统',
        questions: [
          {
            type: 'choice',
            question: '进程和线程的主要区别是？',
            options: [
              '线程是 CPU 调度的最小单位',
              '进程是 CPU 调度的最小单位',
              '线程不能共享内存',
              '进程不能共享内存'
            ],
            answer: 0,
            explanation: '线程是 CPU 调度的最小单位，同一进程的线程共享内存。'
          },
          {
            type: 'choice',
            question: '虚拟内存用于？',
            options: [
              '增加硬盘容量',
              '扩展可用内存空间',
              '提高 CPU 速度',
              '减少功耗'
            ],
            answer: 1,
            explanation: '虚拟内存使用硬盘空间模拟额外 RAM，允许运行比物理内存大的程序。'
          }
        ]
      },
      'ch13-l04': {
        lessonTitle: '并发与并行',
        questions: [
          {
            type: 'choice',
            question: '并发和并行的区别是？',
            options: [
              '并发是同时处理，并行是交替处理',
              '并发是交替处理，并行是同时处理',
              '并发和并行是一样的',
              '并发用于单核，并行用于多核'
            ],
            answer: 1,
            explanation: '并发是多个任务交替执行（可能单核），并行是多个任务真正同时执行（多核）。'
          },
          {
            type: 'fill',
            question: '死锁的四个必要条件包括互斥、占有且等待、不可抢占和____等待。',
            answer: '循环',
            explanation: '死锁四条件：互斥、占有且等待、不可抢占、循环等待。'
          }
        ]
      },
      'ch13-l05': {
        lessonTitle: '编程语言',
        questions: [
          {
            type: 'choice',
            question: '编译型语言在____时转换为机器码。',
            options: ['运行', '编译', '调试', '链接'],
            answer: 1,
            explanation: '编译型语言在运行前通过编译器转换为机器码。'
          },
          {
            type: 'choice',
            question: '动态类型语言的特点是？',
            options: [
              '类型在编译时确定',
              '类型在运行时确定',
              '没有类型',
              '类型不能改变'
            ],
            answer: 1,
            explanation: '动态类型语言（如 Python）在运行时确定变量类型。'
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
      },
      'ch14-l02': {
        lessonTitle: '链表、栈、队列',
        questions: [
          {
            type: 'choice',
            question: '链表相比数组的优势是？',
            options: [
              '随机访问更快',
              '插入删除操作更快',
              '占用内存更少',
              '缓存更友好'
            ],
            answer: 1,
            explanation: '链表插入删除只需 O(1) 修改指针，数组需要移动元素 O(n)。'
          },
          {
            type: 'choice',
            question: '栈的特点是____。',
            options: [
              '先进先出',
              '后进先出',
              '随机访问',
              '无序'
            ],
            answer: 1,
            explanation: '栈是 LIFO（后进先出），最后进入的元素最先出来。'
          },
          {
            type: 'fill',
            question: '队列是____（填"先进先出"或"后进先出"）的数据结构。',
            answer: '先进先出，FIFO',
            explanation: '队列是 FIFO（先进先出），最先加入的元素最先被移除。'
          }
        ]
      },
      'ch14-l03': {
        lessonTitle: '树',
        questions: [
          {
            type: 'choice',
            question: '二叉搜索树的中序遍历结果是____的。',
            options: ['随机', '有序', '逆序', '无法确定'],
            answer: 1,
            explanation: '二叉搜索树的中序遍历（左 - 根-右）得到升序序列。'
          },
          {
            type: 'choice',
            question: '平衡二叉树的左右子树高度差不超过____。',
            options: ['0', '1', '2', '3'],
            answer: 1,
            explanation: 'AVL 树等平衡二叉树要求任意节点的左右子树高度差不超过 1。'
          },
          {
            type: 'fill',
            question: '堆是一种____树。',
            answer: '完全二叉',
            explanation: '堆是完全二叉树，分为最大堆和最小堆。'
          }
        ]
      },
      'ch14-l04': {
        lessonTitle: '图',
        questions: [
          {
            type: 'choice',
            question: 'DFS 使用____数据结构实现。',
            options: ['队列', '栈', '堆', '哈希表'],
            answer: 1,
            explanation: '深度优先搜索（DFS）可以用栈（或递归）实现。'
          },
          {
            type: 'choice',
            question: 'BFS 使用____数据结构实现。',
            options: ['栈', '队列', '堆', '树'],
            answer: 1,
            explanation: '广度优先搜索（BFS）使用队列实现，按层遍历。'
          },
          {
            type: 'fill',
            question: 'Dijkstra 算法用于求解____路径问题。',
            answer: '最短',
            explanation: 'Dijkstra 算法求解单源最短路径问题（边权非负）。'
          }
        ]
      },
      'ch14-l05': {
        lessonTitle: '排序与搜索',
        questions: [
          {
            type: 'choice',
            question: '快速排序的平均时间复杂度是____。',
            options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
            answer: 1,
            explanation: '快速排序平均时间复杂度 O(n log n)，最坏情况 O(n²)。'
          },
          {
            type: 'choice',
            question: '归并排序使用了____思想。',
            options: [
              '贪心',
              '分治',
              '动态规划',
              '回溯'
            ],
            answer: 1,
            explanation: '归并排序使用分治法：将数组分成两半分别排序，然后合并。'
          },
          {
            type: 'fill',
            question: '二分查找要求数组必须是____的。',
            answer: '有序，排序，排好序',
            explanation: '二分查找只适用于有序数组，时间复杂度 O(log n)。'
          }
        ]
      },

      // ============ 第 15 章：生产级软件工程 ============
      'ch15-l01': {
        lessonTitle: 'Linux 与命令行',
        questions: [
          {
            type: 'choice',
            question: 'Linux 中修改文件权限的命令是____。',
            options: ['chown', 'chmod', 'chgrp', 'chperm'],
            answer: 1,
            explanation: 'chmod 用于修改文件权限，chown 用于修改所有者。'
          },
          {
            type: 'fill',
            question: '管道符____将一个命令的输出作为另一个命令的输入。',
            answer: '|',
            explanation: '管道符 | 将前一个命令的 stdout 连接到后一个命令的 stdin。'
          }
        ]
      },
      'ch15-l02': {
        lessonTitle: 'Git 与仓库管理',
        questions: [
          {
            type: 'choice',
            question: 'git merge 和 git rebase 的主要区别是？',
            options: [
              'merge 保留分支历史，rebase 重写历史',
              'rebase 更快',
              'merge 会丢失提交',
              '没有区别'
            ],
            answer: 0,
            explanation: 'merge 创建合并提交保留分支历史，rebase 将提交变基到目标分支重写历史。'
          },
          {
            type: 'fill',
            question: 'git____命令用于撤销未提交的更改。',
            answer: 'restore,checkout',
            explanation: 'git restore 或 git checkout 可以撤销工作区的更改。'
          }
        ]
      },
      'ch15-l03': {
        lessonTitle: '代码库设计',
        questions: [
          {
            type: 'choice',
            question: 'DRY 原则指的是____。',
            options: [
              'Don\'t Repeat Yourself',
              'Do Repeat Yourself',
              'Don\'t Rely on Others',
              'Design for Reuse Yourself'
            ],
            answer: 0,
            explanation: 'DRY（Don\'t Repeat Yourself）原则要求避免代码重复。'
          },
          {
            type: 'choice',
            question: '高内聚低耦合是指____。',
            options: [
              '模块内部紧密相关，模块间依赖少',
              '模块内部松散相关，模块间依赖多',
              '所有功能放在一个模块',
              '每个模块只有一个功能'
            ],
            answer: 0,
            explanation: '高内聚指模块内功能紧密相关，低耦合指模块间依赖关系少。'
          }
        ]
      },
      'ch15-l04': {
        lessonTitle: '测试与质量保证',
        questions: [
          {
            type: 'choice',
            question: '单元测试测试的是____。',
            options: [
              '整个系统',
              '最小可测试单元',
              '用户界面',
              '数据库'
            ],
            answer: 1,
            explanation: '单元测试测试最小的代码单元（如函数、方法）。'
          },
          {
            type: 'fill',
            question: '____测试验证不同模块间的交互。',
            answer: '集成',
            explanation: '集成测试验证多个模块或服务协同工作是否正常。'
          }
        ]
      },
      'ch15-l05': {
        lessonTitle: '部署与 DevOps',
        questions: [
          {
            type: 'choice',
            question: 'CI/CD 是指____。',
            options: [
              '持续集成/持续部署',
              '持续检查/持续开发',
              '持续集成/持续开发',
              '持续检查/持续部署'
            ],
            answer: 0,
            explanation: 'CI/CD 是持续集成和持续部署的缩写，实现自动化构建和发布。'
          },
          {
            type: 'choice',
            question: 'Docker 容器与虚拟机的区别是？',
            options: [
              '容器共享主机内核，虚拟机有完整操作系统',
              '容器更慢',
              '虚拟机更轻量',
              '容器需要更多资源'
            ],
            answer: 0,
            explanation: 'Docker 容器共享主机操作系统内核，比虚拟机更轻量快速。'
          }
        ]
      },

      // ============ 第 16 章：SIMD 与 GPU 编程 ============
      'ch16-l00': {
        lessonTitle: '为什么用 C++ 及 ML 框架原理',
        questions: [
          {
            type: 'choice',
            question: '深度学习框架底层多用____语言实现。',
            options: ['Python', 'C++', 'Java', 'JavaScript'],
            answer: 1,
            explanation: 'C++ 提供底层硬件控制和性能优化，Python 作为上层接口。'
          },
          {
            type: 'fill',
            question: 'PyTorch 使用____机制实现自动微分。',
            answer: '计算图，动态计算图',
            explanation: 'PyTorch 使用动态计算图（define-by-run）实现自动微分。'
          }
        ]
      },
      'ch16-l01': {
        lessonTitle: '硬件基础',
        questions: [
          {
            type: 'choice',
            question: 'CPU 与 GPU 的主要区别是？',
            options: [
              'CPU 核心少但单核强，GPU 核心多适合并行',
              'GPU 核心少但单核强',
              'CPU 只能串行计算',
              'GPU 不能做图形处理'
            ],
            answer: 0,
            explanation: 'CPU 设计用于低延迟，核心少但单核性能强；GPU 设计用于高吞吐，核心多适合并行计算。'
          },
          {
            type: 'choice',
            question: '内存层次结构中，最快的是____。',
            options: ['RAM', '缓存', '硬盘', '寄存器'],
            answer: 3,
            explanation: '寄存器最快但最少，然后是 L1/L2/L3 缓存、内存、硬盘。'
          }
        ]
      },
      'ch16-l02': {
        lessonTitle: 'ARM 与 NEON',
        questions: [
          {
            type: 'choice',
            question: 'NEON 是 ARM 的____技术。',
            options: ['多线程', 'SIMD', '缓存', '虚拟化'],
            answer: 1,
            explanation: 'NEON 是 ARM 的 SIMD 引擎，用于加速多媒体和信号处理。'
          },
          {
            type: 'fill',
            question: 'SIMD 代表单指令____数据。',
            answer: '多，Multiple',
            explanation: 'SIMD（Single Instruction Multiple Data）单指令多数据流。'
          }
        ]
      },
      'ch16-l03': {
        lessonTitle: 'x86 与 AVX',
        questions: [
          {
            type: 'choice',
            question: 'AVX-512 的向量寄存器宽度是____位。',
            options: ['128', '256', '512', '1024'],
            answer: 2,
            explanation: 'AVX-512 使用 512 位宽向量寄存器，可处理更多并行数据。'
          },
          {
            type: 'choice',
            question: 'SSE 指令集操作____位数据。',
            options: ['64', '128', '256', '512'],
            answer: 1,
            explanation: 'SSE（Streaming SIMD Extensions）使用 128 位寄存器。'
          }
        ]
      },
      'ch16-l04': {
        lessonTitle: 'GPU 架构与 CUDA',
        questions: [
          {
            type: 'choice',
            question: 'CUDA 是____公司推出的并行计算平台。',
            options: ['AMD', 'Intel', 'NVIDIA', 'ARM'],
            answer: 2,
            explanation: 'CUDA 是 NVIDIA 推出的通用并行计算架构。'
          },
          {
            type: 'fill',
            question: 'GPU 中基本的执行单元叫____。',
            answer: '线程，CUDA core，流处理器',
            explanation: 'GPU 由大量并行的 CUDA 核心（流处理器）组成。'
          }
        ]
      },
      'ch16-l05': {
        lessonTitle: 'Triton、TPU 与 Pallas',
        questions: [
          {
            type: 'choice',
            question: 'TPU 是____公司设计的 AI 加速器。',
            options: ['NVIDIA', 'Google', 'AMD', 'Intel'],
            answer: 1,
            explanation: 'TPU（Tensor Processing Unit）是 Google 专为 ML 设计的 ASIC。'
          },
          {
            type: 'choice',
            question: 'Triton 是____语言。',
            options: [
              'GPU 汇编',
              'Python 嵌入的 GPU 编程',
              'CPU 编程',
              'FPGA 编程'
            ],
            answer: 1,
            explanation: 'Triton 是 OpenAI 开发的 Python 嵌入式 GPU 编程语言。'
          }
        ]
      },
      'ch16-l06': {
        lessonTitle: 'RISC-V 与嵌入式',
        questions: [
          {
            type: 'choice',
            question: 'RISC-V 的特点是____。',
            options: [
              '开源免费',
              '闭源商业',
              '仅用于服务器',
              '仅用于手机'
            ],
            answer: 0,
            explanation: 'RISC-V 是开源免费的指令集架构，任何人可以使用和扩展。'
          },
          {
            type: 'fill',
            question: '嵌入式系统通常具有____资源限制。',
            answer: '严格的，内存和计算，有限',
            explanation: '嵌入式系统通常有严格的内存、计算能力和功耗限制。'
          }
        ]
      },
      'ch16-l07': {
        lessonTitle: 'Vulkan 计算与跨平台 GPU',
        questions: [
          {
            type: 'choice',
            question: 'Vulkan 相比 OpenGL 的优势是____。',
            options: [
              '更低的 API 开销',
              '更好的兼容性',
              '更简单的编程',
              '更高的单线程性能'
            ],
            answer: 0,
            explanation: 'Vulkan 是底层 API，提供更直接的硬件控制和更低的驱动开销。'
          },
          {
            type: 'choice',
            question: 'Vulkan Compute 可以用于____。',
            options: [
              '仅图形渲染',
              '通用 GPU 计算',
              '仅 CPU 计算',
              '网络通信'
            ],
            answer: 1,
            explanation: 'Vulkan Compute 使用 Vulkan 进行通用 GPU 计算，不依赖图形管线。'
          }
        ]
      },

      // ============ 第 17 章：AI 推理 ============
      'ch17-l01': {
        lessonTitle: '量化',
        questions: [
          {
            type: 'choice',
            question: 'INT8 量化将____精度的浮点数转换为 8 位整数。',
            options: ['16 位', '32 位', '64 位', '128 位'],
            answer: 1,
            explanation: 'INT8 量化通常将 FP32（32 位浮点）权重和激活转换为 8 位整数。'
          },
          {
            type: 'fill',
            question: '量化感知训练在____过程中模拟量化效应。',
            answer: '训练',
            explanation: '量化感知训练在前向传播模拟量化，反向传播保持精度。'
          }
        ]
      },
      'ch17-l02': {
        lessonTitle: '高效架构',
        questions: [
          {
            type: 'choice',
            question: 'MobileNet 使用____卷积减少计算量。',
            options: [
              '标准',
              '深度可分离',
              '转置',
              '空洞'
            ],
            answer: 1,
            explanation: '深度可分离卷积分解为逐通道卷积和逐点卷积，大幅减少参数。'
          },
          {
            type: 'choice',
            question: '注意力线性化（Linear Attention）将复杂度从 O(n²) 降为____。',
            options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
            answer: 0,
            explanation: '线性注意力通过近似将二次复杂度降为线性。'
          }
        ]
      },
      'ch17-l03': {
        lessonTitle: '服务与批处理',
        questions: [
          {
            type: 'choice',
            question: '动态批处理（dynamic batching）用于____。',
            options: [
              '合并多个请求提高吞吐',
              '减少内存使用',
              '降低延迟',
              '提高精度'
            ],
            answer: 0,
            explanation: '动态批处理将多个请求合并为一个批次，提高 GPU 利用率。'
          },
          {
            type: 'fill',
            question: '模型服务中的____指每秒处理的请求数。',
            answer: '吞吐量，throughput,QPS,TPS',
            explanation: '吞吐量（throughput）是系统单位时间处理的请求数量。'
          }
        ]
      },
      'ch17-l04': {
        lessonTitle: '边缘推理',
        questions: [
          {
            type: 'choice',
            question: '边缘推理的主要挑战是____。',
            options: [
              '网络带宽',
              '计算和内存资源有限',
              '数据隐私',
              '模型精度'
            ],
            answer: 1,
            explanation: '边缘设备（手机、IoT）计算能力和内存有限，需要高效模型。'
          },
          {
            type: 'choice',
            question: 'TensorFlow Lite 用于____设备。',
            options: [
              '服务器',
              '移动和嵌入式',
              '云',
              '超级计算机'
            ],
            answer: 1,
            explanation: 'TensorFlow Lite 是为移动和嵌入式设备优化的轻量级推理引擎。'
          }
        ]
      },
      'ch17-l05': {
        lessonTitle: '扩展与部署',
        questions: [
          {
            type: 'choice',
            question: '模型并行用于____场景。',
            options: [
              '模型太大单个 GPU 放不下',
              '数据量太小',
              '训练速度太快',
              '推理延迟太高'
            ],
            answer: 0,
            explanation: '模型并行将大模型拆分到多个 GPU，解决显存不足问题。'
          },
          {
            type: 'fill',
            question: '____推理是指在用户设备本地运行模型。',
            answer: '端侧，本地，on-device',
            explanation: '端侧推理在用户设备（手机、PC）上运行，无需联网。'
          }
        ]
      },

      // ============ 第 18 章：ML 系统设计 ============
      'ch18-l01': {
        lessonTitle: '系统设计基础',
        questions: [
          {
            type: 'choice',
            question: 'CAP 定理中的三个要素是____。',
            options: [
              '一致性、可用性、分区容错性',
              '速度、准确性、可扩展性',
              '成本、性能、可用性',
              '一致性、准确性、持久性'
            ],
            answer: 0,
            explanation: 'CAP 定理：分布式系统最多同时满足一致性（C）、可用性（A）、分区容错性（P）中的两个。'
          },
          {
            type: 'fill',
            question: '____是指系统处理增长数据量的能力。',
            answer: '可扩展性，scalability',
            explanation: '可扩展性衡量系统通过增加资源应对更大负载的能力。'
          }
        ]
      },
      'ch18-l02': {
        lessonTitle: '云计算',
        questions: [
          {
            type: 'choice',
            question: 'IaaS 代表____。',
            options: [
              'Infrastructure as a Service',
              'Information as a Service',
              'Intelligence as a Service',
              'Integration as a Service'
            ],
            answer: 0,
            explanation: 'IaaS 基础设施即服务，提供虚拟化的计算资源。'
          },
          {
            type: 'choice',
            question: '以下哪个不是主要的云服务商？',
            options: ['AWS', 'Azure', 'GCP', 'MySQL'],
            answer: 3,
            explanation: 'MySQL 是数据库，AWS/Azure/GCP 是三大云服务商。'
          }
        ]
      },
      'ch18-l03': {
        lessonTitle: '大规模基础设施',
        questions: [
          {
            type: 'choice',
            question: '负载均衡器的作用是____。',
            options: [
              '将流量分发到多个服务器',
              '增加服务器功率',
              '存储数据',
              '监控日志'
            ],
            answer: 0,
            explanation: '负载均衡器将请求分发到多个后端服务器，提高可用性和扩展性。'
          },
          {
            type: 'fill',
            question: '____数据库适合水平扩展。',
            answer: 'NoSQL，非关系型',
            explanation: 'NoSQL 数据库（如 Cassandra）设计用于水平扩展。'
          }
        ]
      },
      'ch18-l04': {
        lessonTitle: 'ML 系统设计',
        questions: [
          {
            type: 'choice',
            question: '特征存储（Feature Store）用于____。',
            options: [
              '存储和管理 ML 特征',
              '存储模型参数',
              '存储训练数据',
              '存储日志'
            ],
            answer: 0,
            explanation: '特征存储集中管理 ML 特征，支持训练和推理复用。'
          },
          {
            type: 'choice',
            question: '训练 - 推理偏差是指____。',
            options: [
              '训练和推理环境不一致导致的问题',
              '模型训练太慢',
              '推理结果不准确',
              '数据分布变化'
            ],
            answer: 0,
            explanation: '训练 - 推理偏差来源于训练和推理代码/数据/预处理不一致。'
          }
        ]
      },
      'ch18-l05': {
        lessonTitle: 'ML 设计示例',
        questions: [
          {
            type: 'choice',
            question: '推荐系统常用的评估指标是____。',
            options: ['准确率', '召回率', 'NDCG', '以上都是'],
            answer: 3,
            explanation: '推荐系统使用多种指标评估：准确率、召回率、NDCG、MRR 等。'
          },
          {
            type: 'fill',
            question: '____学习用于没有标签数据的场景。',
            answer: '无监督，unsupervised',
            explanation: '无监督学习从无标签数据中学习模式和结构。'
          }
        ]
      },

      // ============ 第 19 章：应用 AI ============
      'ch19-l01': {
        lessonTitle: 'AI 在金融',
        questions: [
          {
            type: 'choice',
            question: '欺诈检测是____问题。',
            options: [
              '回归',
              '二分类',
              '聚类',
              '降维'
            ],
            answer: 1,
            explanation: '欺诈检测判断交易是否欺诈，是典型的二分类问题。'
          },
          {
            type: 'fill',
            question: '量化交易使用____方法做投资决策。',
            answer: '数学和统计，定量，quantitative',
            explanation: '量化交易使用数学模型和统计方法而非主观判断。'
          }
        ]
      },
      'ch19-l02': {
        lessonTitle: '蛋白质设计',
        questions: [
          {
            type: 'choice',
            question: 'AlphaFold 预测的是____。',
            options: [
              'DNA 序列',
              '蛋白质 3D 结构',
              'RNA 序列',
              '氨基酸序列'
            ],
            answer: 1,
            explanation: 'AlphaFold 使用深度学习从氨基酸序列预测蛋白质 3D 结构。'
          },
          {
            type: 'choice',
            question: '蛋白质由____组成。',
            options: ['核苷酸', '氨基酸', '脂肪酸', '糖'],
            answer: 1,
            explanation: '蛋白质由 20 种氨基酸通过肽键连接而成。'
          }
        ]
      },
      'ch19-l03': {
        lessonTitle: '药物发现',
        questions: [
          {
            type: 'choice',
            question: '虚拟筛选用于____。',
            options: [
              '从大量化合物中筛选候选药物',
              '测试药物毒性',
              '合成药物',
              '分析临床试验数据'
            ],
            answer: 0,
            explanation: '虚拟筛选使用计算方法从化合物库中筛选潜在候选药物。'
          },
          {
            type: 'fill',
            question: '药物 - 靶点____预测药物与蛋白质的结合亲和力。',
            answer: '结合，相互作用',
            explanation: '药物 - 靶点结合预测评估候选药物与目标蛋白质的结合能力。'
          }
        ]
      },
      'ch19-l04': {
        lessonTitle: '智能体系统',
        questions: [
          {
            type: 'choice',
            question: 'AI Agent 的核心组件不包括____。',
            options: ['感知', '规划', '动作', '编译'],
            answer: 3,
            explanation: 'AI Agent 核心组件：感知环境、规划行动、执行动作，编译不是。'
          },
          {
            type: 'choice',
            question: 'ReAct 框架结合了____。',
            options: [
              '推理和行动',
              '学习和记忆',
              '感知和控制',
              '规划和执行'
            ],
            answer: 0,
            explanation: 'ReAct（Reasoning+Acting）框架交替进行推理和采取行动。'
          }
        ]
      },
      'ch19-l05': {
        lessonTitle: 'AI 在医疗',
        questions: [
          {
            type: 'choice',
            question: '医学影像 AI 主要用于____。',
            options: [
              '辅助诊断',
              '药物定价',
              '预约管理',
              '病历录入'
            ],
            answer: 0,
            explanation: '医学影像 AI 辅助医生检测病灶、分类病变等诊断任务。'
          },
          {
            type: 'fill',
            question: '医疗 AI 需要符合____法规保护患者隐私。',
            answer: 'HIPAA，数据保护，隐私保护',
            explanation: '医疗 AI 需要符合 HIPAA 等隐私保护法规。'
          }
        ]
      },

      // ============ 第 20 章：前沿 AI ============
      'ch20-l01': {
        lessonTitle: '量子机器学习',
        questions: [
          {
            type: 'choice',
            question: '量子比特（qubit）可以处于____状态。',
            options: [
              '0 或 1',
              '0 和 1 的叠加',
              '只能是 0',
              '只能是 1'
            ],
            answer: 1,
            explanation: '量子比特可以处于 0 和 1 的叠加态，这是量子计算的基础。'
          },
          {
            type: 'fill',
            question: '量子____允许量子计算机同时处理多个计算路径。',
            answer: '并行，叠加',
            explanation: '量子并行性源于叠加态，可同时探索多个计算路径。'
          }
        ]
      },
      'ch20-l02': {
        lessonTitle: '神经形态计算',
        questions: [
          {
            type: 'choice',
            question: '神经形态芯片模拟的是____结构。',
            options: ['CPU', 'GPU', '生物神经元', '内存'],
            answer: 2,
            explanation: '神经形态计算模拟生物神经元和突触的结构和工作方式。'
          },
          {
            type: 'choice',
            question: '类脑计算的优势是____。',
            options: [
              '高能效',
              '高频率',
              '大内存',
              '多核心'
            ],
            answer: 0,
            explanation: '神经形态芯片事件驱动、存算一体，具有极高的能效比。'
          }
        ]
      },
      'ch20-l03': {
        lessonTitle: '太空数据中心',
        questions: [
          {
            type: 'choice',
            question: '太空数据中心的主要优势是____。',
            options: [
              '免费太阳能和自然冷却',
              '更接近用户',
              '更低的发射成本',
              '更少的法规限制'
            ],
            answer: 0,
            explanation: '太空有持续的太阳能和接近绝对零度的背景温度用于冷却。'
          },
          {
            type: 'fill',
            question: '太空环境的主要挑战包括辐射、____和通信延迟。',
            answer: '微重力，真空，极端温度',
            explanation: '太空有强辐射、微重力/无重力、高真空和极端温度变化。'
          }
        ]
      },
      'ch20-l04': {
        lessonTitle: '去中心化 AI',
        questions: [
          {
            type: 'choice',
            question: '联邦学习的特点是____。',
            options: [
              '数据不出本地',
              '集中所有数据训练',
              '只有一台服务器',
              '不需要通信'
            ],
            answer: 0,
            explanation: '联邦学习在本地设备上训练，只上传模型更新，保护数据隐私。'
          },
          {
            type: 'choice',
            question: '区块链可以用于 AI 的____方面。',
            options: [
              '数据溯源',
              '模型压缩',
              '超参数调优',
              '数据增强'
            ],
            answer: 0,
            explanation: '区块链的不可篡改性可用于追踪训练数据来源和模型版本。'
          }
        ]
      },
      'ch20-l05': {
        lessonTitle: '脑机接口',
        questions: [
          {
            type: 'choice',
            question: '侵入式脑机接口需要____。',
            options: [
              '手术植入电极',
              '佩戴头盔',
              '贴电极片',
              '无需接触'
            ],
            answer: 0,
            explanation: '侵入式 BCI 需要手术将电极植入大脑皮层，信号质量高但有创。'
          },
          {
            type: 'fill',
            question: 'Neuralink 是____公司开发的脑机接口。',
            answer: '马斯克，Elon Musk',
            explanation: 'Neuralink 是 Elon Musk 创立的脑机接口公司。'
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

    const result = {
      correct: isCorrect,
      explanation: question.explanation,
      correctAnswer: question.type === 'choice'
        ? question.options[question.answer]
        : question.answer
    };

    // 如果答错，自动记录到错题本
    if (!isCorrect) {
      Storage.addWrongAnswer(
        lessonId,
        questionIndex,
        userAnswer,
        result.correctAnswer,
        question.explanation
      );
    }

    return result;
  },

  // 获取题目数量
  getQuestionCount(lessonId) {
    const quiz = this.getQuiz(lessonId);
    return quiz ? quiz.questions.length : 0;
  }
};

// 导出到全局
window.QuizData = QuizData;
