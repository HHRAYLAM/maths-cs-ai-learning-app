// 依赖关系图可视化 - 分层布局 (清晰、可点击)

const DependencyGraph = {
  // 配置
  config: {
    nodeWidth: 180,
    nodeHeight: 60,
    levelSpacing: 100,    // 层级间距
    nodeSpacing: 70,      // 节点间距
    padding: 80
  },

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

    const { nodes, edges, levels } = this.buildGraphData(chapters, dependencies);

    if (nodes.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🎉</div>
          <div class="empty-state-title">暂无依赖关系</div>
          <div class="empty-state-description">当前内容包中的课程没有设置先修关系</div>
        </div>
      `;
      return;
    }

    this.renderLayeredGraph(container, nodes, edges, levels);
  },

  // 构建图数据（分层布局）
  buildGraphData(chapters, dependencies) {
    const nodeMap = new Map();
    const edges = [];
    const inDegree = new Map(); // 每个节点的入度
    const outEdges = new Map(); // 每个节点的出边

    // 创建所有节点
    for (const chapter of chapters) {
      for (const lesson of (chapter.lessons || [])) {
        const progress = Storage.getLessonProgress(lesson.id);
        nodeMap.set(lesson.id, {
          id: lesson.id,
          title: lesson.title,
          chapter: chapter.title,
          chapterId: chapter.id,
          chapterOrder: chapter.order || 1,
          status: progress?.status || 'not-started'
        });
        inDegree.set(lesson.id, 0);
        outEdges.set(lesson.id, []);
      }
    }

    // 构建依赖关系
    for (const dep of dependencies) {
      if (nodeMap.has(dep.from) && nodeMap.has(dep.to)) {
        edges.push({
          source: dep.from,
          target: dep.to
        });
        inDegree.set(dep.to, (inDegree.get(dep.to) || 0) + 1);
        outEdges.get(dep.from).push(dep.to);
      }
    }

    // 使用 Kahn 算法进行拓扑排序并分层
    const levels = [];
    const visited = new Set();
    const queue = [];

    // 找出所有入度为 0 的节点（最基础的课程）
    for (const [nodeId, degree] of inDegree) {
      if (degree === 0) {
        queue.push(nodeId);
      }
    }

    // 如果没有入度为 0 的节点，将所有节点放入第一层
    if (queue.length === 0) {
      for (const nodeId of nodeMap.keys()) {
        queue.push(nodeId);
      }
    }

    // BFS 分层
    while (queue.length > 0) {
      const levelSize = queue.length;
      const currentLevel = [];

      for (let i = 0; i < levelSize; i++) {
        const nodeId = queue.shift();
        if (visited.has(nodeId)) continue;
        visited.add(nodeId);
        currentLevel.push(nodeId);

        // 将相邻节点加入下一层
        for (const targetId of outEdges.get(nodeId) || []) {
          inDegree.set(targetId, inDegree.get(targetId) - 1);
          if (inDegree.get(targetId) === 0 && !visited.has(targetId)) {
            queue.push(targetId);
          }
        }
      }

      if (currentLevel.length > 0) {
        levels.push(currentLevel);
      }
    }

    // 处理剩余节点（有环的情况）
    const remainingNodes = Array.from(nodeMap.keys()).filter(id => !visited.has(id));
    if (remainingNodes.length > 0) {
      // 按章节分组
      const chapterGroups = new Map();
      for (const nodeId of remainingNodes) {
        const node = nodeMap.get(nodeId);
        const key = node.chapterId;
        if (!chapterGroups.has(key)) {
          chapterGroups.set(key, []);
        }
        chapterGroups.get(key).push(nodeId);
      }

      // 添加到层级
      for (const [chapterId, nodeIds] of chapterGroups) {
        levels.push(nodeIds);
      }
    }

    // 为每个节点分配层级和位置
    const nodesWithPosition = [];
    levels.forEach((level, levelIndex) => {
      level.forEach((nodeId, nodeIndex) => {
        const node = nodeMap.get(nodeId);
        if (node) {
          node.level = levelIndex;
          node.position = nodeIndex;
          node.totalInLevel = level.length;
          nodesWithPosition.push(node);
        }
      });
    });

    return { nodes: nodesWithPosition, edges, levels };
  },

  // 渲染分层图
  renderLayeredGraph(container, nodes, edges, levels) {
    const width = Math.max(container.clientWidth || 1000, 1000);
    const height = Math.max((levels.length * this.config.levelSpacing) + 200, 600);

    container.innerHTML = '';

    // 控制栏
    const controls = document.createElement('div');
    controls.className = 'dependency-controls';
    controls.innerHTML = `
      <button id="dep-zoom-in" class="control-btn" title="放大">+</button>
      <button id="dep-zoom-out" class="control-btn" title="缩小">−</button>
      <button id="dep-reset" class="control-btn" title="重置">⟲</button>
      <span class="control-hint">💡 滚轮缩放 / 拖拽平移 / 点击课程</span>
    `;
    container.appendChild(controls);

    // 创建 SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'dependency-svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    const contentWidth = Math.max(width, this.calculateContentWidth(levels));
    svg.setAttribute('viewBox', `0 0 ${contentWidth} ${height}`);

    // 创建可缩放的内容容器（包裹所有图层）
    const containerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    containerGroup.setAttribute('class', 'zoom-container');

    // 创建 defs
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <marker id="arrowhead-dep" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
        <polygon points="0 0, 10 3, 0 6" fill="#999" />
      </marker>
      <!-- 渐变色 -->
      <linearGradient id="grad-math" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#5B7C99;stop-opacity:0.15" />
        <stop offset="100%" style="stop-color:#3D5266;stop-opacity:0.15" />
      </linearGradient>
      <linearGradient id="grad-ai" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#4ECDC4;stop-opacity:0.15" />
        <stop offset="100%" style="stop-color:#2D9B8B;stop-opacity:0.15" />
      </linearGradient>
      <linearGradient id="grad-cs" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FFD93D;stop-opacity:0.15" />
        <stop offset="100%" style="stop-color:#E5B800;stop-opacity:0.15" />
      </linearGradient>
      <linearGradient id="grad-system" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#9B5DE5;stop-opacity:0.15" />
        <stop offset="100%" style="stop-color:#7B3FB8;stop-opacity:0.15" />
      </linearGradient>
    `;
    svg.appendChild(defs);

    container.appendChild(svg);
    svg.appendChild(containerGroup);

    // 计算节点坐标
    const nodeCoordinates = this.calculateNodeCoordinates(nodes, levels, contentWidth, height);

    // 绘制边
    const edgesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    edgesGroup.setAttribute('class', 'edges-group');

    edges.forEach(edge => {
      const source = nodeCoordinates.get(edge.source);
      const target = nodeCoordinates.get(edge.target);
      if (source && target) {
        const path = this.createEdgePath(source, target);
        edgesGroup.appendChild(path);
      }
    });

    containerGroup.appendChild(edgesGroup);

    // 绘制节点
    const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodesGroup.setAttribute('class', 'nodes-group');

    nodes.forEach(node => {
      const coords = nodeCoordinates.get(node.id);
      if (coords) {
        const nodeEl = this.createNodeElement(node, coords.x, coords.y);
        nodesGroup.appendChild(nodeEl);
      }
    });

    containerGroup.appendChild(nodesGroup);

    // 绘制层级标签
    const labelsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    labelsGroup.setAttribute('class', 'level-labels');

    levels.forEach((level, index) => {
      const label = this.createLevelLabel(index, height);
      labelsGroup.appendChild(label);
    });

    containerGroup.appendChild(labelsGroup);
    svg.appendChild(containerGroup);

    // 绑定交互
    this.bindInteractions(container, svg, containerGroup, nodesGroup, nodeCoordinates);
  },

  // 计算内容宽度
  calculateContentWidth(levels) {
    const maxNodesInLevel = Math.max(...levels.map(l => l.length));
    return Math.max(800, (maxNodesInLevel * (this.config.nodeWidth + this.config.nodeSpacing)) + this.config.padding * 2);
  },

  // 计算节点坐标
  calculateNodeCoordinates(nodes, levels, contentWidth, height) {
    const coords = new Map();
    const config = this.config;

    levels.forEach((level, levelIndex) => {
      const levelWidth = level.length * (config.nodeWidth + config.nodeSpacing);
      const startX = (contentWidth - levelWidth) / 2;
      const y = config.padding + levelIndex * config.levelSpacing;

      level.forEach((nodeId, nodeIndex) => {
        const x = startX + nodeIndex * (config.nodeWidth + config.nodeSpacing) + config.nodeWidth / 2;
        coords.set(nodeId, { x, y });
      });
    });

    return coords;
  },

  // 创建边路径
  createEdgePath(source, target) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // 贝塞尔曲线
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const controlOffset = Math.min(Math.abs(dy) * 0.5, 80);

    const d = `M ${source.x} ${source.y + 30}
               C ${source.x} ${source.y + 30 + controlOffset},
                 ${target.x} ${target.y - 30 - controlOffset},
                 ${target.x} ${target.y - 30}`;

    path.setAttribute('d', d);
    path.setAttribute('class', 'edge-path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#999');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('marker-end', 'url(#arrowhead-dep)');
    path.setAttribute('opacity', '0.6');

    return path;
  },

  // 创建节点元素
  createNodeElement(node, x, y) {
    const config = this.config;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'node-group');
    g.setAttribute('data-lesson-id', node.id);
    g.setAttribute('transform', `translate(${x}, ${y})`);
    g.style.cursor = 'pointer';

    // 根据领域获取渐变色
    const domain = this.getDomain(node.chapterId);
    const gradientId = `grad-${domain}`;

    // 节点背景
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', config.nodeWidth);
    rect.setAttribute('height', config.nodeHeight);
    rect.setAttribute('rx', '12');
    rect.setAttribute('ry', '12');
    rect.setAttribute('fill', `url(#${gradientId})`);
    rect.setAttribute('stroke', this.getNodeStroke(node.status));
    rect.setAttribute('stroke-width', '2.5');
    rect.setAttribute('x', -config.nodeWidth / 2);
    rect.setAttribute('y', -config.nodeHeight / 2);

    // 标题（自动换行）
    const title = this.createWrappedText(node.title, 0, -5, config.nodeWidth - 20);

    // 章节
    const chapter = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    chapter.setAttribute('text-anchor', 'middle');
    chapter.setAttribute('fill', '#6e6e73');
    chapter.setAttribute('font-size', '10');
    chapter.setAttribute('y', '18');
    chapter.textContent = this.truncateText(node.chapter, 15);

    // 状态点
    const statusDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    statusDot.setAttribute('r', '6');
    statusDot.setAttribute('cx', config.nodeWidth / 2 - 10);
    statusDot.setAttribute('cy', -config.nodeHeight / 2 + 10);
    statusDot.setAttribute('fill', this.getStatusColor(node.status));

    g.appendChild(rect);
    g.appendChild(title);
    g.appendChild(chapter);
    g.appendChild(statusDot);

    return g;
  },

  // 创建自动换行文本
  createWrappedText(text, x, y, maxWidth) {
    const fontSize = 12;
    const charWidth = fontSize * 0.6; // 估算字符宽度
    const maxChars = Math.floor(maxWidth / charWidth);

    if (text.length <= maxChars) {
      const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textEl.setAttribute('text-anchor', 'middle');
      textEl.setAttribute('fill', '#1d1d1f');
      textEl.setAttribute('font-size', String(fontSize));
      textEl.setAttribute('font-weight', '600');
      textEl.setAttribute('y', String(y));
      textEl.textContent = text;
      return textEl;
    }

    // 需要换行
    const lines = [];
    let currentLine = '';

    for (const word of text.split(' ')) {
      if ((currentLine + word).length > maxChars) {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }
    lines.push(currentLine.trim());

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const lineHeight = fontSize + 4;
    const startY = y - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, i) => {
      const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textEl.setAttribute('text-anchor', 'middle');
      textEl.setAttribute('fill', '#1d1d1f');
      textEl.setAttribute('font-size', String(fontSize));
      textEl.setAttribute('font-weight', i === 0 ? '600' : '500');
      textEl.setAttribute('y', String(startY + i * lineHeight));
      textEl.textContent = line;
      g.appendChild(textEl);
    });

    return g;
  },

  // 截断文本
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 2) + '...';
  },

  // 获取节点所属领域
  getDomain(chapterId) {
    const match = chapterId.match(/ch(\d+)/);
    if (!match) return 'math';
    const num = parseInt(match[1]);

    if (num <= 5) return 'math';
    if (num <= 10) return 'ai';
    if (num <= 15) return 'cs';
    return 'system';
  },

  // 创建层级标签
  createLevelLabel(levelIndex, svgHeight) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const y = this.config.padding + levelIndex * this.config.levelSpacing;

    const labels = ['基础', '进阶', '高级', '专家', '大师'];
    const label = labels[levelIndex] || `L${levelIndex + 1}`;

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '20');
    text.setAttribute('y', String(y + 4));
    text.setAttribute('fill', '#999');
    text.setAttribute('font-size', '11');
    text.setAttribute('font-weight', '600');
    text.textContent = label;

    g.appendChild(text);
    return g;
  },

  // 绑定交互
  bindInteractions(container, svg, containerGroup, nodesGroup, nodeCoordinates) {
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isPanning = false;
    let startX, startY;

    // 缩放控制
    document.getElementById('dep-zoom-in')?.addEventListener('click', (e) => {
      e.stopPropagation();
      scale = Math.min(scale * 1.3, 4);
      updateTransform();
    });

    document.getElementById('dep-zoom-out')?.addEventListener('click', (e) => {
      e.stopPropagation();
      scale = Math.max(scale / 1.3, 0.3);
      updateTransform();
    });

    document.getElementById('dep-reset')?.addEventListener('click', (e) => {
      e.stopPropagation();
      scale = 1;
      translateX = 0;
      translateY = 0;
      updateTransform();
    });

    // 滚轮缩放
    svg.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1.1 : 0.9;
      scale = Math.max(0.3, Math.min(4, scale * delta));
      updateTransform();
    }, { passive: false });

    // 拖拽平移
    svg.addEventListener('mousedown', (e) => {
      if (e.target === svg || e.target.classList.contains('edges-group') || e.target.classList.contains('nodes-group') || e.target.classList.contains('zoom-container')) {
        isPanning = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        svg.style.cursor = 'grabbing';
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (isPanning) {
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
      }
    });

    window.addEventListener('mouseup', () => {
      isPanning = false;
      svg.style.cursor = 'grab';
    });

    // 节点点击打开课程
    nodesGroup.querySelectorAll('.node-group').forEach(group => {
      group.addEventListener('click', () => {
        const lessonId = group.getAttribute('data-lesson-id');
        if (lessonId) {
          // 优先使用 LessonViewer.open，回退到 SkillTree.openLesson
          if (window.LessonViewer?.open) {
            LessonViewer.open(lessonId);
          } else if (window.SkillTree?.openLesson) {
            SkillTree.openLesson(lessonId);
          }
        }
      });
    });

    function updateTransform() {
      // 先缩放后平移，应用 transform-origin 到视口中心
      containerGroup.setAttribute('transform', `scale(${scale}) translate(${translateX}, ${translateY})`);
    }
  },

  getNodeStroke(status) {
    const colors = {
      'not-started': '#86868b',
      'learning': '#ff9500',
      'completed': '#34c759',
      'mastered': '#007aff'
    };
    return colors[status] || '#86868b';
  },

  getStatusColor(status) {
    const colors = {
      'not-started': '#86868b',
      'learning': '#ff9500',
      'completed': '#34c759',
      'mastered': '#007aff'
    };
    return colors[status] || '#86868b';
  },

  clearHighlight(container) {
    container.querySelectorAll('.node-group').forEach(node => {
      node.classList.remove('highlighted');
    });
  }
};

window.DependencyGraph = DependencyGraph;
