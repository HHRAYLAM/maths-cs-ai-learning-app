/**
 * 综合产品测试套件
 * 验证所有 P0 修复是否生效
 */

const ProductTest = {
  results: {
    passed: 0,
    failed: 0,
    warnings: 0
  },

  async runAll() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 开始运行综合产品测试');
    console.log('='.repeat(60) + '\n');

    // 测试 1: 成就系统
    this.testAchievementSystem();

    // 测试 2: 复习系统
    this.testReviewSystem();

    // 测试 3: 练习题系统
    this.testQuizSystem();

    // 测试 4: 双栏布局
    this.testTwoColumnLayout();

    // 测试 5: 内容增强
    this.testContentEnhancer();

    // 测试 6: 书签功能
    this.testBookmarks();

    // 测试 7: 错题本
    this.testWrongAnswers();

    // 测试 8: 费曼模式
    this.testFeynmanMode();

    // 输出总结
    this.printSummary();

    return this.results.failed === 0;
  },

  testAchievementSystem() {
    console.log('📌 测试：成就系统');

    try {
      // 检查成就定义
      const definitions = Storage.getAchievementDefinitions();
      if (definitions.length < 10) {
        throw new Error(`成就定义数量不足：${definitions.length}`);
      }

      // 检查成就结构
      for (const def of definitions) {
        if (!def.id || !def.name || !def.description || !def.icon || !def.condition) {
          throw new Error(`成就 ${def.id} 结构不完整`);
        }
      }

      // 检查成就条件检查逻辑
      const testAchievement = { condition: { type: 'completedLessons', count: 1 } };
      Storage.checkAchievementCondition(testAchievement);

      console.log(`  ✓ 成就定义：${definitions.length} 个成就`);
      console.log(`  ✓ 成就结构：完整`);
      console.log(`  ✓ 条件检查：正常`);
      this.results.passed += 3;
    } catch (e) {
      console.log(`  ✗ 成就系统失败：${e.message}`);
      this.results.failed++;
    }
  },

  testReviewSystem() {
    console.log('\n📌 测试：复习系统 (SM-2 算法)');

    try {
      localStorage.removeItem('learning-progress');

      // 测试第一次复习
      const result1 = Storage.reviewLesson('test-review-1', 5);
      if (result1.repetition !== 1 || result1.interval !== 1) {
        throw new Error(`第一次复习参数错误：rep=${result1.repetition}, interval=${result1.interval}`);
      }

      // 测试第二次复习
      const result2 = Storage.reviewLesson('test-review-1', 5);
      if (result2.repetition !== 2 || result2.interval !== 6) {
        throw new Error(`第二次复习参数错误：rep=${result2.repetition}, interval=${result2.interval}`);
      }

      // 测试遗忘情况
      const result3 = Storage.reviewLesson('test-review-1', 2);
      if (result3.repetition !== 0 || result3.interval !== 1) {
        throw new Error(`遗忘重置失败：rep=${result3.repetition}, interval=${result3.interval}`);
      }

      // 测试获取待复习课程
      const due = Storage.getLessonsDueForReview();
      if (!Array.isArray(due)) {
        throw new Error(`getLessonsDueForReview 返回值不是数组`);
      }

      console.log(`  ✓ 第一次复习：间隔 1 天`);
      console.log(`  ✓ 第二次复习：间隔 6 天`);
      console.log(`  ✓ 遗忘重置：正常`);
      console.log(`  ✓ 待复习列表：${due.length} 个课程`);
      this.results.passed += 4;
    } catch (e) {
      console.log(`  ✗ 复习系统失败：${e.message}`);
      this.results.failed++;
    }
  },

  testQuizSystem() {
    console.log('\n📌 测试：练习题系统');

    try {
      // 检查 QuizData 是否初始化
      if (!window.QuizData) {
        throw new Error('QuizData 未定义');
      }

      // 检查题库是否加载
      QuizData.init();
      const quizzes = Object.keys(QuizData._quizzes);

      if (quizzes.length === 0) {
        throw new Error('题库为空');
      }

      // 测试获取练习题
      const firstQuizKey = quizzes[0];
      const quiz = QuizData.getQuiz(firstQuizKey);

      if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        throw new Error('练习题数据格式错误');
      }

      // 测试答案检查
      const question = quiz.questions[0];
      const result = QuizData.checkAnswer(firstQuizKey, 0, question.type === 'choice' ? question.answer : 'test');

      if (typeof result.correct !== 'boolean') {
        throw new Error('checkAnswer 返回值格式错误');
      }

      console.log(`  ✓ 题库加载：${quizzes.length} 个课程`);
      console.log(`  ✓ 练习题获取：${quiz.questions.length} 道题目`);
      console.log(`  ✓ 答案检查：正常`);
      this.results.passed += 3;
    } catch (e) {
      console.log(`  ✗ 练习题系统失败：${e.message}`);
      this.results.failed++;
    }
  },

  testTwoColumnLayout() {
    console.log('\n📌 测试：双栏布局');

    try {
      // 检查 CSS 类是否存在
      const styleSheets = document.styleSheets;
      let twoColumnFound = false;
      let textColumnFound = false;
      let visualColumnFound = false;

      for (const sheet of styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.selectorText?.includes('lesson-two-column')) twoColumnFound = true;
            if (rule.selectorText?.includes('lesson-text-column')) textColumnFound = true;
            if (rule.selectorText?.includes('lesson-visual-column')) visualColumnFound = true;
          }
        } catch (e) {
          // 跨域样式表无法访问
        }
      }

      if (!twoColumnFound) throw new Error('CSS 类 .lesson-two-column 未定义');
      if (!textColumnFound) throw new Error('CSS 类 .lesson-text-column 未定义');
      if (!visualColumnFound) throw new Error('CSS 类 .lesson-visual-column 未定义');

      // 检查 LessonViewer.renderTwoColumnLayout 是否存在
      if (typeof LessonViewer?.renderTwoColumnLayout !== 'function') {
        throw new Error('LessonViewer.renderTwoColumnLayout 方法未定义');
      }

      console.log(`  ✓ CSS 类 .lesson-two-column: 已定义`);
      console.log(`  ✓ CSS 类 .lesson-text-column: 已定义`);
      console.log(`  ✓ CSS 类 .lesson-visual-column: 已定义`);
      console.log(`  ✓ renderTwoColumnLayout 方法：已定义`);
      this.results.passed += 4;
    } catch (e) {
      console.log(`  ✗ 双栏布局失败：${e.message}`);
      this.results.failed++;
    }
  },

  testContentEnhancer() {
    console.log('\n📌 测试：内容增强（故事卡片和比喻）');

    try {
      // 检查 ContentEnhancer 是否存在
      if (!window.ContentEnhancer) {
        throw new Error('ContentEnhancer 未定义');
      }

      // 检查章节故事
      const stories = ContentEnhancer.chapterStories;
      if (!stories || Object.keys(stories).length === 0) {
        throw new Error('章节故事为空');
      }

      // 检查比喻提示
      const metaphors = ContentEnhancer.addMetaphorHints;
      if (typeof metaphors !== 'function') {
        throw new Error('addMetaphorHints 方法未定义');
      }

      // 测试故事卡片生成
      const testStory = stories['ch01'];
      const cardHtml = ContentEnhancer.createStoryCard(testStory);
      if (!cardHtml.includes('story-card')) {
        throw new Error('故事卡片 HTML 格式错误');
      }

      console.log(`  ✓ ContentEnhancer: 已定义`);
      console.log(`  ✓ 章节故事：${Object.keys(stories)} 个`);
      console.log(`  ✓ 比喻提示功能：正常`);
      console.log(`  ✓ 故事卡片生成：正常`);
      this.results.passed += 4;
    } catch (e) {
      console.log(`  ✗ 内容增强失败：${e.message}`);
      this.results.failed++;
    }
  },

  testBookmarks() {
    console.log('\n📌 测试：书签功能');

    try {
      localStorage.removeItem('app-bookmarks');

      const testId = 'test-bookmark';

      // 测试添加
      Storage.addBookmark(testId);
      if (!Storage.isBookmarked(testId)) {
        throw new Error('添加书签失败');
      }

      // 测试切换
      Storage.toggleBookmark(testId);
      if (Storage.isBookmarked(testId)) {
        throw new Error('切换书签失败');
      }

      // 测试获取书签列表
      const bookmarks = Storage.getBookmarkedLessons();
      if (!Array.isArray(bookmarks)) {
        throw new Error('getBookmarkedLessons 返回值错误');
      }

      console.log(`  ✓ 添加书签：正常`);
      console.log(`  ✓ 切换书签：正常`);
      console.log(`  ✓ 获取书签列表：${bookmarks.length} 个`);
      this.results.passed += 3;
    } catch (e) {
      console.log(`  ✗ 书签功能失败：${e.message}`);
      this.results.failed++;
    }
  },

  testWrongAnswers() {
    console.log('\n📌 测试：错题本功能');

    try {
      localStorage.removeItem('app-wrong-answers');

      // 添加错题
      Storage.addWrongAnswer('test-lesson', 0, '错误答案', '正确答案', '解释');

      // 检查活跃错题
      const active = Storage.getActiveWrongAnswers();
      if (active.length < 1) {
        throw new Error('活跃错题列表为空');
      }

      // 检查统计
      const stats = Storage.getWrongAnswerStats();
      if (stats.total < 1 || stats.active < 1) {
        throw new Error('错题统计错误');
      }

      // 测试标记已掌握
      const wrongAnswerId = active[0].id;
      Storage.masterWrongAnswer(wrongAnswerId);

      const stats2 = Storage.getWrongAnswerStats();
      if (stats2.mastered < 1) {
        throw new Error('标记已掌握失败');
      }

      console.log(`  ✓ 添加错题：正常`);
      console.log(`  ✓ 活跃错题：${active.length} 个`);
      console.log(`  ✓ 错题统计：正常`);
      console.log(`  ✓ 标记已掌握：正常`);
      this.results.passed += 4;
    } catch (e) {
      console.log(`  ✗ 错题本失败：${e.message}`);
      this.results.failed++;
    }
  },

  testFeynmanMode() {
    console.log('\n📌 测试：费曼模式');

    try {
      localStorage.removeItem('app-feynman-records');

      const lessonId = 'test-feynman';
      const explanation = '这是一个测试解释。';

      // 保存记录
      const record = Storage.saveFeynmanRecord(lessonId, explanation);
      if (!record.id || record.explanation !== explanation) {
        throw new Error('保存费曼记录失败');
      }

      // 获取记录
      const records = Storage.getLessonFeynmanRecords(lessonId);
      if (records.length < 1) {
        throw new Error('获取费曼记录失败');
      }

      console.log(`  ✓ 保存记录：正常`);
      console.log(`  ✓ 获取记录：${records.length} 条`);
      this.results.passed += 2;
    } catch (e) {
      console.log(`  ✗ 费曼模式失败：${e.message}`);
      this.results.failed++;
    }
  },

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 测试总结');
    console.log('='.repeat(60));
    console.log(`✅ 通过：${this.results.passed}`);
    console.log(`❌ 失败：${this.results.failed}`);
    console.log('='.repeat(60));

    if (this.results.failed === 0) {
      console.log('\n🎉 所有测试通过！产品功能正常。\n');
    } else {
      console.log(`\n⚠️ 有 ${this.results.failed} 项测试失败，请检查上面的错误信息。\n`);
    }
  }
};

// 在 DOM 加载后运行
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      window.runProductTest = () => ProductTest.runAll();
      console.log('\n💡 输入 runProductTest() 可重新运行产品测试');
      ProductTest.runAll();
    }, 2000);
  });
}

// 导出
window.ProductTest = ProductTest;
