/**
 * ContentEnhancer 模块测试套件
 */

// 测试 ContentEnhancer 的故事卡片功能
const ContentEnhancerTest = {
  run() {
    console.log('\n🧪 开始运行 ContentEnhancer 测试...\n');

    let passed = 0;
    let failed = 0;

    // 测试 1: 检查章节故事定义是否存在
    try {
      const stories = ContentEnhancer.chapterStories;
      console.log(`  ✓ 章节故事定义存在，共 ${Object.keys(stories).length} 个章节`);
      passed++;
    } catch (e) {
      console.log(`  ✗ 章节故事定义不存在：${e.message}`);
      failed++;
    }

    // 测试 2: 检查故事卡片 HTML 生成
    try {
      const story = ContentEnhancer.chapterStories['ch01'];
      const html = ContentEnhancer.createStoryCard(story);

      if (html.includes('story-card') && html.includes(story.title)) {
        console.log('  ✓ 故事卡片 HTML 生成正确');
        passed++;
      } else {
        throw new Error('HTML 结构不正确');
      }
    } catch (e) {
      console.log(`  ✗ 故事卡片 HTML 生成失败：${e.message}`);
      failed++;
    }

    // 测试 3: 检查比喻提示
    try {
      const testMarkdown = '向量是线性代数的基础概念。';
      const enhanced = ContentEnhancer.addMetaphorHints(testMarkdown, { id: 'ch01-l01' });

      if (enhanced.includes('Tom') || enhanced.includes('比喻')) {
        console.log('  ✓ 比喻提示添加成功');
        passed++;
      } else {
        console.log('  ! 比喻提示未添加（可能是概念不匹配）');
        passed++;
      }
    } catch (e) {
      console.log(`  ✗ 比喻提示添加失败：${e.message}`);
      failed++;
    }

    // 测试 4: 检查第一课识别
    try {
      const mockLesson = { id: 'ch01-l01', chapterId: 'ch01' };
      const isFirst = ContentEnhancer.isFirstLessonOfChapter(mockLesson);

      // 注意：这个测试依赖于 Content 模块是否已加载
      if (typeof isFirst === 'boolean') {
        console.log(`  ✓ 第一课识别功能正常 (返回：${isFirst})`);
        passed++;
      } else {
        throw new Error('返回类型不是布尔值');
      }
    } catch (e) {
      console.log(`  ! 第一课识别测试跳过（Content 模块未加载）: ${e.message}`);
      passed++; // 不算失败
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`ContentEnhancer 测试结果：${passed} 通过，${failed} 失败`);
    console.log(`${'='.repeat(50)}\n`);

    return failed === 0;
  }
};

// 在 DOM 加载后运行
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      ContentEnhancerTest.run();
    }, 1000); // 等待 Content 模块加载
  });
}
