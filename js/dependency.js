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

    // 构建节点和依赖映射
    const nodeMap = new Map();
    const dependencyMap = new Map(); // to -> [from...]
    const dependedByMap = new Map(); // from -> [to...]

    for (const chapter of chapters) {
      for (const lesson of (chapter.lessons || [])) {
        const nodeId = lesson.id;
        const prereqs = lesson.prerequisites || [];

        nodeMap.set(nodeId, {
          id: nodeId,
          title: lesson.title,
          chapter: chapter.title,
          chapterId: chapter.id,
          prereqCount: prereqs.length,
          dependedByCount: 0,
          progress: Storage.getLessonProgress(nodeId),
          isRoot: prereqs.length === 0
        });

        dependencyMap.set(nodeId, prereqs);
        dependedByMap.set(nodeId, []);
      }
    }

    // 计算每个节点被多少其他节点依赖
    for (const [lessonId, prereqs] of dependencyMap.entries()) {
      for (const prereqId of prereqs) {
        const count = dependedByMap.get(prereqId)?.length || 0;
        dependedByMap.set(prereqId, [...(dependedByMap.get(prereqId) || []), lessonId]);

        const node = nodeMap.get(prereqId);
        if (node) {
          node.dependedByCount++;
        }
      }
    }

    // 更新被依赖数量
    for (const [lessonId, dependents] of dependedByMap.entries()) {
      const node = nodeMap.get(lessonId);
      if (node) {
        node.dependedByCount = dependents.length;
      }
    }

    // 分类节点：根节点（无先修）、中间节点、叶节点（不被依赖）
    const rootNodes = [];
    const intermediateNodes = [];
    const leafNodes = [];

    for (const node of nodeMap.values()) {
      if (node.isRoot && node.dependedByCount > 0) {
        rootNodes.push(node);
      } else if (!node.isRoot && node.dependedByCount > 0) {
        intermediateNodes.push(node);
      } else if (node.dependedByCount === 0) {
        leafNodes.push(node);
      }
    }

    // 检查是否有依赖关系
    const hasDependencies = dependencies.length > 0;

    if (!hasDependencies) {
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
      <div class="dependency-legend">
        <div class="legend-item">
          <div class="legend-dot root"></div>
          <span>基础课程（${rootNodes.length}个）</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot intermediate"></div>
          <span>中级课程（${intermediateNodes.length}个）</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot leaf"></div>
          <span>高级课程（${leafNodes.length}个）</span>
        </div>
      </div>

      <div class="dependency-content">
        ${rootNodes.length > 0 ? this.renderLevel('基础课程', rootNodes, 'root') : ''}
        ${intermediateNodes.length > 0 ? this.renderLevel('中级课程', intermediateNodes, 'intermediate') : ''}
        ${leafNodes.length > 0 ? this.renderLevel('高级课程', leafNodes, 'leaf') : ''}
      </div>
    `;

    // 绑定点击事件
    container.querySelectorAll('.dependency-node').forEach(node => {
      node.addEventListener('click', (e) => {
        const lessonId = node.dataset.lessonId;
        if (lessonId) {
          const nodeElement = nodeMap.get(lessonId);
          // 如果按下 Ctrl/Cmd 键，高亮依赖路径
          if (e.ctrlKey || e.metaKey) {
            this.highlightPath(lessonId);
            showToast('已高亮依赖路径，再次点击空白处清除');
            return;
          }
          if (nodeElement && nodeElement.dependedByCount === 0 && nodeElement.isRoot === false) {
            // 只有叶节点和中间节点可以直接进入
            SkillTree.openLesson(lessonId);
          } else if (nodeElement) {
            // 根节点显示提示
            showToast('这是基础课程，可以直接开始学习！');
            SkillTree.openLesson(lessonId);
          }
        }
      });
    });

    // 点击空白处清除高亮
    container.addEventListener('click', (e) => {
      if (e.target === container || e.target.classList.contains('dependency-content')) {
        this.clearHighlight();
      }
    });
  },

  // 渲染层级
  renderLevel(title, nodes, type) {
    return `
      <div class="dependency-level" data-level="${type}">
        <div class="dependency-level-title">${title}</div>
        <div class="dependency-grid">
          ${nodes.map(node => this.renderNode(node, type)).join('')}
        </div>
      </div>
    `;
  },

  // 渲染节点
  renderNode(node, type) {
    const status = node.progress?.status || 'not-started';
    const isCompleted = status === 'completed' || status === 'mastered';
    const progressPercent = node.progress?.percent || 0;

    const statusIcons = {
      'not-started': '○',
      'learning': '◐',
      'completed': '✓',
      'mastered': '★'
    };

    // 获取先修课程标题
    const prereqs = dependencyMap.get(node.id) || [];
    const prereqTitles = prereqs.slice(0, 2).map(id => {
      const prereq = Content.getLesson(id);
      return prereq?.title || id;
    });

    return `
      <div class="dependency-node ${status} ${node.isRoot ? 'root-node' : ''}" data-lesson-id="${node.id}">
        <div class="dependency-node-title">
          ${statusIcons[status]} ${node.title}
        </div>
        <div class="dependency-node-chapter">📚 ${node.chapter}</div>
        ${prereqTitles.length > 0 ? `
          <div class="dependency-indicator">
            <span class="dependency-arrow">⬅</span>
            <span>需先修：${prereqTitles.join(', ')}</span>
          </div>
        ` : ''}
        ${node.dependedByCount > 0 ? `
          <div class="dependency-indicator">
            <span class="dependency-arrow">➡</span>
            <span class="dependency-count">🔗 ${node.dependedByCount} 门课程依赖</span>
          </div>
        ` : ''}
        ${isCompleted ? `
          <div class="mini-progress">
            <div class="mini-progress-fill" style="width: ${progressPercent}%"></div>
          </div>
        ` : ''}
      </div>
    `;
  },

  // 高亮某个节点的依赖路径
  highlightPath(lessonId) {
    const container = document.querySelector('.dependency-container');
    if (!container) return;

    // 获取完整依赖树
    const fullPrereqs = Content.getFullPrerequisites(lessonId);

    // 高亮依赖路径上的所有节点
    container.querySelectorAll('.dependency-node').forEach(node => {
      const id = node.dataset.lessonId;
      if (id === lessonId || fullPrereqs.some(p => p.id === id)) {
        node.classList.add('highlighted');
      } else {
        node.classList.add('dimmed');
      }
    });
  },

  // 清除高亮
  clearHighlight() {
    const container = document.querySelector('.dependency-container');
    if (!container) return;

    container.querySelectorAll('.dependency-node').forEach(node => {
      node.classList.remove('highlighted', 'dimmed');
    });
  }
};

window.DependencyGraph = DependencyGraph;
