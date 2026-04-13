/**
 * Storage 模块测试套件
 * 使用简单的断言框架，无需外部依赖
 */

// 简单的断言工具
const assert = {
  equal(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`${message || 'Assertion failed'}: expected ${expected}, got ${actual}`);
    }
  },

  deepEqual(actual, expected, message) {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    if (actualStr !== expectedStr) {
      throw new Error(`${message || 'Assertion failed'}: expected ${expectedStr}, got ${actualStr}`);
    }
  },

  ok(value, message) {
    if (!value) {
      throw new Error(message || 'Expected truthy value');
    }
  },

  notOk(value, message) {
    if (value) {
      throw new Error(message || 'Expected falsy value');
    }
  },

  throws(fn, message) {
    try {
      fn();
      throw new Error(message || 'Expected function to throw');
    } catch (e) {
      if (e.message.includes('Expected function to throw')) {
        throw e;
      }
    }
  }
};

// 测试运行器
const TestRunner = {
  tests: [],
  passed: 0,
  failed: 0,

  test(name, fn) {
    this.tests.push({ name, fn });
  },

  async run() {
    console.log(`\n🧪 开始运行 ${this.tests.length} 个测试...\n`);

    for (const test of this.tests) {
      try {
        await test.fn();
        console.log(`  ✓ ${test.name}`);
        this.passed++;
      } catch (e) {
        console.log(`  ✗ ${test.name}`);
        console.log(`    Error: ${e.message}`);
        this.failed++;
      }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`结果：${this.passed} 通过，${this.failed} 失败`);
    console.log(`${'='.repeat(50)}\n`);

    return this.failed === 0;
  }
};

// ============ 测试套件 ============

// 成就定义测试
TestRunner.test('成就系统 - 成就定义应该完整', () => {
  const definitions = Storage.getAchievementDefinitions();

  assert.ok(definitions.length > 0, '应该有成就定义');
  assert.ok(definitions.length >= 10, '应该至少有 10 个成就');

  // 检查每个成就的结构
  definitions.forEach(achievement => {
    assert.ok(achievement.id, '成就应该有 id');
    assert.ok(achievement.name, '成就应该有 name');
    assert.ok(achievement.description, '成就应该有 description');
    assert.ok(achievement.icon, '成就应该有 icon');
    assert.ok(achievement.condition, '成就应该有 condition');
  });
});

// 成就解锁条件测试
TestRunner.test('成就系统 - 完成课程类成就条件检查', () => {
  const stats = { completed: 5, mastered: 0 };

  // 模拟 getStats 返回值
  const originalGetStats = Storage.getStats;
  Storage.getStats = () => stats;

  try {
    // 5 个完成课程应该解锁"初学者"成就
    const firstLessonAchievement = Storage.getAchievementDefinition('first_lesson');
    const fiveLessonsAchievement = Storage.getAchievementDefinition('five_lessons');
    const tenLessonsAchievement = Storage.getAchievementDefinition('ten_lessons');

    assert.ok(firstLessonAchievement, '应该存在"第一步"成就');
    assert.equal(firstLessonAchievement.condition.count, 1, '"第一步"成就应该需要 1 个课程');
    assert.equal(fiveLessonsAchievement.condition.count, 5, '"初学者"成就应该需要 5 个课程');
    assert.equal(tenLessonsAchievement.condition.count, 10, '"进取者"成就应该需要 10 个课程');
  } finally {
    Storage.getStats = originalGetStats;
  }
});

// 连续学习天数测试
TestRunner.test('成就系统 - 连续学习天数计算', () => {
  // 清除本地存储
  localStorage.removeItem('learning-progress');

  const streak = Storage.getLearningStreak();
  assert.ok(typeof streak === 'number', '连续学习天数应该是数字');
  assert.ok(streak >= 0, '连续学习天数应该非负');
});

// 成就条件检查测试
TestRunner.test('成就系统 - 条件检查逻辑', () => {
  const achievement = {
    id: 'test_achievement',
    condition: { type: 'completedLessons', count: 5 }
  };

  // 模拟 stats
  const originalGetStats = Storage.getStats;
  Storage.getStats = () => ({ completed: 3, mastered: 1, totalReviews: 0 });

  try {
    // 4 个完成课程 < 5 个要求
    const result = Storage.checkAchievementCondition(achievement);
    assert.notOk(result, '4 个课程不应该解锁需要 5 个课程的成就');

    // 5 个完成课程 >= 5 个要求
    Storage.getStats = () => ({ completed: 5, mastered: 0, totalReviews: 0 });
    const result2 = Storage.checkAchievementCondition(achievement);
    assert.ok(result2, '5 个课程应该解锁需要 5 个课程的成就');
  } finally {
    Storage.getStats = originalGetStats;
  }
});

// 复习系统测试 - SM-2 算法
TestRunner.test('复习系统 - SM-2 算法间隔计算', () => {
  localStorage.removeItem('learning-progress');

  // 首次复习（repetition = 0）
  let result = Storage.reviewLesson('test-lesson-1', 5); // quality = 5 (完美)
  assert.equal(result.repetition, 1, '第一次复习后重复次数应该是 1');
  assert.equal(result.interval, 1, '第一次复习后间隔应该是 1 天');

  // 第二次复习（repetition = 1）
  result = Storage.reviewLesson('test-lesson-1', 5);
  assert.equal(result.repetition, 2, '第二次复习后重复次数应该是 2');
  assert.equal(result.interval, 6, '第二次复习后间隔应该是 6 天');

  // 第三次复习（repetition = 2）
  result = Storage.reviewLesson('test-lesson-1', 5);
  assert.ok(result.interval > 6, '第三次复习后间隔应该大于 6 天');
  assert.ok(result.easeFactor >= 1.3, '难度因子应该至少为 1.3');
});

// 复习系统测试 - 遗忘情况
TestRunner.test('复习系统 - 遗忘时重置间隔', () => {
  localStorage.removeItem('learning-progress');

  // 先完成一次复习
  Storage.reviewLesson('test-lesson-2', 5);
  Storage.reviewLesson('test-lesson-2', 5);

  // 遗忘（quality = 2）
  const result = Storage.reviewLesson('test-lesson-2', 2);

  assert.equal(result.repetition, 0, '遗忘后重复次数应该重置为 0');
  assert.equal(result.interval, 1, '遗忘后间隔应该重置为 1 天');
  assert.equal(result.status, 'learning', '遗忘后状态应该是 learning');
});

// 需要复习的课程列表
TestRunner.test('复习系统 - 获取需要复习的课程', () => {
  localStorage.removeItem('learning-progress');

  // 手动设置一个需要复习的课程
  const progress = Storage.getProgress();
  progress['test-lesson-due'] = {
    status: 'completed',
    lastReviewedAt: Date.now() - (10 * 24 * 60 * 60 * 1000), // 10 天前
    interval: 1,
    repetition: 0
  };
  Storage.saveProgress(progress);

  const dueLessons = Storage.getLessonsDueForReview();

  assert.ok(Array.isArray(dueLessons), '返回的应该是数组');
  const dueLesson = dueLessons.find(l => l.lessonId === 'test-lesson-due');
  assert.ok(dueLesson, '应该包含需要复习的课程');
  assert.ok(dueLesson.daysOverdue > 0, '应该有逾期天数');
});

// 书签功能测试
TestRunner.test('书签系统 - 添加和移除书签', () => {
  localStorage.removeItem('app-bookmarks');

  const testLessonId = 'test-bookmark-lesson';

  // 添加书签
  const added = Storage.addBookmark(testLessonId);
  assert.ok(added, '添加书签应该返回 true');

  // 检查是否已添加
  const isBookmarked = Storage.isBookmarked(testLessonId);
  assert.ok(isBookmarked, '应该检测到书签');

  // 移除书签
  const removed = Storage.removeBookmark(testLessonId);
  assert.ok(removed, '移除书签应该返回 true');

  // 检查是否已移除
  const isBookmarkedAfter = Storage.isBookmarked(testLessonId);
  assert.notOk(isBookmarkedAfter, '书签应该已移除');
});

// 切换书签测试
TestRunner.test('书签系统 - 切换书签状态', () => {
  localStorage.removeItem('app-bookmarks');

  const testLessonId = 'test-toggle-bookmark';

  // 第一次切换（添加）
  const result1 = Storage.toggleBookmark(testLessonId);
  assert.ok(result1, '切换应该返回 true（添加）');
  assert.ok(Storage.isBookmarked(testLessonId), '书签应该存在');

  // 第二次切换（移除）
  const result2 = Storage.toggleBookmark(testLessonId);
  assert.notOk(result2, '切换应该返回 false（移除）');
  assert.notOk(Storage.isBookmarked(testLessonId), '书签应该不存在');
});

// 错题本功能测试
TestRunner.test('错题本 - 添加错题', () => {
  localStorage.removeItem('app-wrong-answers');

  const result = Storage.addWrongAnswer(
    'test-lesson',
    0, // question index
    '错误答案',
    '正确答案',
    '解释说明'
  );

  assert.ok(result, '添加错题应该成功');

  const activeWrongs = Storage.getActiveWrongAnswers();
  assert.ok(activeWrongs.length > 0, '应该有未掌握的错题');

  const stats = Storage.getWrongAnswerStats();
  assert.equal(stats.active, 1, '应该有 1 个活跃错题');
  assert.equal(stats.total, 1, '总错题数应该是 1');
});

// 错题掌握测试
TestRunner.test('错题本 - 标记错题已掌握', () => {
  localStorage.removeItem('app-wrong-answers');

  // 添加错题
  Storage.addWrongAnswer('test-lesson', 0, '错误', '正确', '解释');

  const activeWrongs = Storage.getActiveWrongAnswers();
  const wrongAnswerId = activeWrongs[0].id;

  // 标记为已掌握
  const result = Storage.masterWrongAnswer(wrongAnswerId);
  assert.ok(result, '标记已掌握应该成功');

  const stats = Storage.getWrongAnswerStats();
  assert.equal(stats.mastered, 1, '应该有 1 个已掌握错题');
  assert.ok(parseFloat(stats.masteryRate) > 0, '掌握率应该大于 0');
});

// 费曼模式测试
TestRunner.test('费曼模式 - 保存和获取解释记录', () => {
  localStorage.removeItem('app-feynman-records');

  const lessonId = 'test-feynman-lesson';
  const explanation = '这是一个测试解释，用简单的语言描述概念。';

  // 保存记录
  const record = Storage.saveFeynmanRecord(lessonId, explanation);

  assert.ok(record.id, '记录应该有 ID');
  assert.equal(record.lessonId, lessonId, '记录的课程 ID 应该匹配');
  assert.equal(record.explanation, explanation, '记录的解释应该匹配');

  // 获取记录
  const records = Storage.getLessonFeynmanRecords(lessonId);
  assert.ok(records.length > 0, '应该至少有一条记录');
  assert.equal(records[0].explanation, explanation, '获取的解释应该匹配');
});

// 语言设置测试
TestRunner.test('语言设置 - 获取和设置语言', () => {
  const originalLang = Storage.getLanguage();

  try {
    // 设置英文
    Storage.setLanguage('en-US');
    assert.equal(Storage.getLanguage(), 'en-US', '语言应该设置为 en-US');

    // 设置中文
    Storage.setLanguage('zh-CN');
    assert.equal(Storage.getLanguage(), 'zh-CN', '语言应该设置为 zh-CN');
  } finally {
    Storage.setLanguage(originalLang);
  }
});

// 主题设置测试
TestRunner.test('主题设置 - 获取和设置主题', () => {
  const originalTheme = Storage.getTheme();

  try {
    // 设置暗色
    Storage.setTheme('dark');
    assert.equal(Storage.getTheme(), 'dark', '主题应该设置为 dark');

    // 设置亮色
    Storage.setTheme('light');
    assert.equal(Storage.getTheme(), 'light', '主题应该设置为 light');

    // 设置自动
    Storage.setTheme('auto');
    assert.equal(Storage.getTheme(), 'auto', '主题应该设置为 auto');
  } finally {
    Storage.setTheme(originalTheme);
  }
});

// 统计数据测试
TestRunner.test('统计数据 - 获取学习统计', () => {
  const stats = Storage.getStats();

  assert.ok(typeof stats === 'object', '统计应该是对象');
  assert.ok(typeof stats.totalLessons === 'number', '总课程数应该是数字');
  assert.ok(typeof stats.completionRate === 'string', '完成率应该是字符串');
  assert.ok(typeof stats.totalTimeSeconds === 'number', '总时间应该是数字');
});

// ============ 运行测试 ============

// 在 DOM 加载完成后运行测试
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', async () => {
    const success = await TestRunner.run();

    // 在页面上显示结果
    const resultDiv = document.createElement('div');
    resultDiv.id = 'test-results';
    resultDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: white; padding: 16px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 9999; max-height: 80vh; overflow-y: auto; font-family: monospace; font-size: 12px;';
    resultDiv.innerHTML = `
      <h3 style="margin: 0 0 8px 0;">测试结果</h3>
      <div style="color: ${success ? 'green' : 'red'}; font-weight: bold;">
        ${TestRunner.passed} 通过，${TestRunner.failed} 失败
      </div>
    `;

    document.body.appendChild(resultDiv);

    if (!success) {
      console.error('❌ 部分测试失败，请检查上面的错误信息');
    } else {
      console.log('✅ 所有测试通过！');
    }
  });
}

// 导出测试运行器
window.TestRunner = TestRunner;
window.assert = assert;
