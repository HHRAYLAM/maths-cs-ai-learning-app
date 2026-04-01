// 依赖关系图组件

const DependencyGraph = {
  // 渲染依赖图
  render(container) {
    const chapters = Content.getChapters();
    const dependencies = Content.getAllDependencies();

    if (!chapters || chapters.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔗</div>
          <div class="empty-state-title">暂无内容</div>
          <div class="empty-state-description">依赖图加载中...</div>
        </div>
      `;
      return;
    }

    // 构建节点列表
    const nodes = [];
    const nodeMap = new Map();

    for (const chapter of chapters) {
      for (const lesson of (chapter.lessons || [])) {
        const node = {
          id: lesson.id,
          title: lesson.title,
          chapter: chapter.title,
          hasPrereqs: (lesson.prerequisites || []).length > 0,
          isPrereqForOthers: false,
          progress: Storage.getLessonProgress(lesson.id)
        };
        nodes.push(node);
        nodeMap.set(lesson.id, node);
      }
    }

    // 标记哪些节点是其他节点的先修
    for (const dep of dependencies) {
      const targetNode = nodeMap.get(dep.to);
      if (targetNode) {
        targetNode.isPrereqForOthers = true;
      }
    }

    // 只显示有依赖关系的节点
    const filteredNodes = nodes.filter(node =>
      node.hasPrereqs || node.isPrereqForOthers
    );

    if (filteredNodes.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🎉</div>
          <div class="empty-state-title">暂无依赖关系</div>
          <div class="empty-state-description">当前内容包中的课程没有设置先修关系</div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="dependency-container">
        <p style="color: var(--gray-500); font-size: 14px; margin-bottom: 16px;">
          点击节点进入课程学习
        </p>
        ${filteredNodes.map(node => this.renderNode(node)).join('')}
      </div>
    `;

    // 绑定点击事件
    container.querySelectorAll('.dependency-node').forEach(node => {
      node.addEventListener('click', () => {
        const lessonId = node.dataset.lessonId;
        if (lessonId) {
          SkillTree.openLesson(lessonId);
        }
      });
    });
  },

  // 渲染节点
  renderNode(node) {
    const status = node.progress?.status || 'not-started';
    const isCompleted = status === 'completed' || status === 'mastered';

    return `
      <div class="dependency-node ${status} ${isCompleted ? 'completed' : ''}" data-lesson-id="${node.id}">
        <div class="dependency-node-title">${node.title}</div>
        <div class="dependency-node-chapter">${node.chapter}</div>
      </div>
    `;
  },

  // 高亮某个节点的依赖路径
  highlightPath(lessonId) {
    // 未来可以实现：高亮显示从根节点到当前节点的完整路径
    console.log('高亮路径:', lessonId);
  }
};

window.DependencyGraph = DependencyGraph;
