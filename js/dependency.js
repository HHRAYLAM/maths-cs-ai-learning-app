// 依赖关系图可视化 - 力导向网状图（D3.js）

const DependencyGraph = {
  // 配置
  config: {
    nodeWidth: 220,      // 节点宽度
    nodeHeight: 90,      // 节点高度
    charge: -800,        // 节点间斥力
    linkDistance: 250,   // 连线长度
    padding: 100         // 边距
  },

  // 渲染依赖图
  render(container) {
    console.log('依赖图渲染开始（力导向网状图）...');

    const chapters = Content.getChapters();
    const dependencies = Content.getAllDependencies();

    console.log('章节数:', chapters?.length || 0);
    console.log('依赖关系数:', dependencies?.length || 0);

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

    // 构建节点和边数据
    const { nodes, edges } = this.buildGraphData(chapters, dependencies);

    console.log('节点数:', nodes.length);
    console.log('边数:', edges.length);

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

    // 渲染力导向图
    this.renderForceDirectedGraph(container, nodes, edges);
  },

  // 构建图数据
  buildGraphData(chapters, dependencies) {
    const nodeMap = new Map();
    const edges = [];

    // 创建节点
    for (const chapter of chapters) {
      for (const lesson of (chapter.lessons || [])) {
        const progress = Storage.getLessonProgress(lesson.id);
        nodeMap.set(lesson.id, {
          id: lesson.id,
          title: lesson.title,
          chapter: chapter.title,
          chapterId: chapter.id,
          status: progress?.status || 'not-started',
          x: Math.random() * 800 - 400,
          y: Math.random() * 600 - 300
        });
      }
    }

    // 创建边
    for (const dep of dependencies) {
      if (nodeMap.has(dep.from) && nodeMap.has(dep.to)) {
        edges.push({
          source: dep.from,
          target: dep.to,
          type: 'prerequisite'
        });
      }
    }

    return {
      nodes: Array.from(nodeMap.values()),
      edges
    };
  },

  // 渲染力导向图
  renderForceDirectedGraph(container, nodes, edges) {
    const width = Math.max(window.innerWidth - 40, 1200);
    const height = Math.max(window.innerHeight - 200, 800);

    // 清空容器
    container.innerHTML = '';

    // 创建控制栏
    const controls = document.createElement('div');
    controls.className = 'dependency-controls';
    controls.innerHTML = `
      <button id="dep-zoom-in" class="control-btn" title="放大">🔍+</button>
      <button id="dep-zoom-out" class="control-btn" title="缩小">🔍-</button>
      <button id="dep-reset" class="control-btn" title="重置">⟲</button>
      <span class="control-hint">💡 拖拽节点 / 滚轮缩放 / 点击课程</span>
    `;
    container.appendChild(controls);

    // 创建 SVG 容器
    const svgContainer = document.createElement('div');
    svgContainer.className = 'svg-viewport';
    svgContainer.innerHTML = `
      <svg class="dependency-svg" width="${width}" height="${height}">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#999" />
          </marker>
          <marker id="arrowhead-highlight" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#4A90D9" />
          </marker>
        </defs>
        <g class="graph-content" transform="translate(${width/2}, ${height/2})">
          <g class="edges-group"></g>
          <g class="nodes-group"></g>
        </g>
      </svg>
    `;
    container.appendChild(svgContainer);

    const svg = svgContainer.querySelector('.dependency-svg');
    const graphContent = svg.querySelector('.graph-content');
    const edgesGroup = svg.querySelector('.edges-group');
    const nodesGroup = svg.querySelector('.nodes-group');

    // 创建边
    edges.forEach(edge => {
      const edgeEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      edgeEl.setAttribute('class', 'edge');
      edgeEl.setAttribute('stroke', '#ddd');
      edgeEl.setAttribute('stroke-width', '2');
      edgeEl.setAttribute('marker-end', 'url(#arrowhead)');
      edgesGroup.appendChild(edgeEl);
    });

    // 创建节点
    const config = this.config;
    nodes.forEach(node => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'node-group');
      g.setAttribute('data-lesson-id', node.id);
      g.setAttribute('cursor', 'pointer');
      g.setAttribute('transform', `translate(${node.x}, ${node.y})`);

      // 节点背景（圆角矩形）
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', config.nodeWidth);
      rect.setAttribute('height', config.nodeHeight);
      rect.setAttribute('rx', '12');
      rect.setAttribute('ry', '12');
      rect.setAttribute('fill', this.getNodeBackground(node.status));
      rect.setAttribute('stroke', this.getNodeStroke(node.status));
      rect.setAttribute('stroke-width', '3');
      rect.setAttribute('x', -config.nodeWidth / 2);
      rect.setAttribute('y', -config.nodeHeight / 2);

      // 标题
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      title.setAttribute('text-anchor', 'middle');
      title.setAttribute('dominant-baseline', 'middle');
      title.setAttribute('fill', '#333');
      title.setAttribute('font-size', '13');
      title.setAttribute('font-weight', '600');
      title.setAttribute('y', '-10');

      // 截断长标题
      let displayTitle = node.title;
      if (displayTitle.length > 25) {
        displayTitle = displayTitle.substring(0, 22) + '...';
      }
      title.textContent = displayTitle;

      // 章节信息
      const chapter = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      chapter.setAttribute('text-anchor', 'middle');
      chapter.setAttribute('dominant-baseline', 'middle');
      chapter.setAttribute('fill', '#666');
      chapter.setAttribute('font-size', '11');
      chapter.setAttribute('y', '15');
      chapter.textContent = node.chapter;

      // 状态图标
      const statusIcon = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      statusIcon.setAttribute('r', '8');
      statusIcon.setAttribute('cx', config.nodeWidth / 2 - 15);
      statusIcon.setAttribute('cy', -config.nodeHeight / 2 + 15);
      statusIcon.setAttribute('fill', this.getStatusColor(node.status));

      g.appendChild(rect);
      g.appendChild(title);
      g.appendChild(chapter);
      g.appendChild(statusIcon);
      nodesGroup.appendChild(g);
    });

    // 简单的力导向布局模拟
    let simulationRunning = true;
    let iterations = 0;
    const maxIterations = 300;

    const simulate = () => {
      if (!simulationRunning || iterations >= maxIterations) return;

      iterations++;

      // 计算斥力（节点间相互排斥）
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = config.charge / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          n1.x += fx;
          n1.y += fy;
          n2.x -= fx;
          n2.y -= fy;
        }
      }

      // 计算引力（相连的节点相互吸引）
      edges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (!source || !target) return;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - config.linkDistance) * 0.05;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        source.x += fx;
        source.y += fy;
        target.x -= fx;
        target.y -= fy;
      });

      // 边界限制
      const boundary = Math.min(width, height) / 2 - config.padding;
      nodes.forEach(node => {
        node.x = Math.max(-boundary, Math.min(boundary, node.x));
        node.y = Math.max(-boundary, Math.min(boundary, node.y));
      });

      // 更新视图
      this.updateView(nodes, edges, edgesGroup, nodesGroup, config);

      // 继续模拟
      if (iterations < maxIterations) {
        requestAnimationFrame(simulate);
      }
    };

    // 启动模拟
    simulate();

    // 绑定交互事件
    this.bindEvents(container, nodes, edges, graphContent, svgContainer);
  },

  // 更新视图
  updateView(nodes, edges, edgesGroup, nodesGroup, config) {
    // 更新边
    const edgeElements = edgesGroup.querySelectorAll('line');
    edges.forEach((edge, i) => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      if (!source || !target) return;

      const line = edgeElements[i];
      if (line) {
        line.setAttribute('x1', source.x);
        line.setAttribute('y1', source.y);
        line.setAttribute('x2', target.x);
        line.setAttribute('y2', target.y);
      }
    });

    // 更新节点位置
    const nodeElements = nodesGroup.querySelectorAll('.node-group');
    nodes.forEach((node, i) => {
      const el = nodeElements[i];
      if (el) {
        el.setAttribute('transform', `translate(${node.x}, ${node.y})`);
      }
    });
  },

  // 获取节点背景色
  getNodeBackground(status) {
    const colors = {
      'not-started': '#ffffff',
      'learning': '#fff3cd',
      'completed': '#d4edda',
      'mastered': '#d1ecf1'
    };
    return colors[status] || '#ffffff';
  },

  // 获取节点边框色
  getNodeStroke(status) {
    const colors = {
      'not-started': '#6c757d',
      'learning': '#ffc107',
      'completed': '#28a745',
      'mastered': '#17a2b8'
    };
    return colors[status] || '#6c757d';
  },

  // 获取状态圆点颜色
  getStatusColor(status) {
    const colors = {
      'not-started': '#6c757d',
      'learning': '#ffc107',
      'completed': '#28a745',
      'mastered': '#17a2b8'
    };
    return colors[status] || '#6c757d';
  },

  // 绑定交互事件
  bindEvents(container, nodes, edges, graphContent, svgContainer) {
    // 节点点击 - 打开课程
    container.querySelectorAll('.node-group').forEach(group => {
      group.addEventListener('click', () => {
        const lessonId = group.getAttribute('data-lesson-id');
        if (lessonId) {
          this.highlightPath(lessonId, container);
          // 延迟一点打开课程，让用户看到高亮
          setTimeout(() => {
            if (window.SkillTree && SkillTree.openLesson) {
              SkillTree.openLesson(lessonId);
            }
          }, 300);
        }
      });
    });

    // 缩放控制
    let scale = 1;
    document.getElementById('dep-zoom-in')?.addEventListener('click', () => {
      scale = Math.min(scale * 1.3, 4);
      graphContent.setAttribute('transform', `translate(${1200/2}, ${800/2}) scale(${scale})`);
    });

    document.getElementById('dep-zoom-out')?.addEventListener('click', () => {
      scale = Math.max(scale / 1.3, 0.3);
      graphContent.setAttribute('transform', `translate(${1200/2}, ${800/2}) scale(${scale})`);
    });

    document.getElementById('dep-reset')?.addEventListener('click', () => {
      scale = 1;
      graphContent.setAttribute('transform', `translate(${1200/2}, ${800/2}) scale(1)`);
    });

    // 滚轮缩放
    svgContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        scale = Math.min(scale * 1.1, 4);
      } else {
        scale = Math.max(scale / 1.1, 0.3);
      }
      graphContent.setAttribute('transform', `translate(${1200/2}, ${800/2}) scale(${scale})`);
    }, { passive: false });

    // 拖拽功能
    let draggedNode = null;
    let offsetX = 0, offsetY = 0;

    svgContainer.addEventListener('mousedown', (e) => {
      const nodeGroup = e.target.closest('.node-group');
      if (nodeGroup) {
        draggedNode = nodes.find(n => n.id === nodeGroup.getAttribute('data-lesson-id'));
        const transform = nodeGroup.getAttribute('transform');
        const match = transform.match(/translate\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/);
        if (match) {
          offsetX = e.clientX - parseFloat(match[1]);
          offsetY = e.clientY - parseFloat(match[2]);
        }
      }
    });

    svgContainer.addEventListener('mousemove', (e) => {
      if (draggedNode) {
        draggedNode.x = e.clientX - offsetX;
        draggedNode.y = e.clientY - offsetY;
        this.updateView(nodes, edges, svgContainer.querySelector('.edges-group'), svgContainer.querySelector('.nodes-group'), this.config);
      }
    });

    svgContainer.addEventListener('mouseup', () => {
      draggedNode = null;
    });

    svgContainer.addEventListener('mouseleave', () => {
      draggedNode = null;
    });
  },

  // 高亮路径
  highlightPath(lessonId, container) {
    console.log('高亮路径:', lessonId);

    // 清除之前的高亮
    this.clearHighlight(container);

    // 高亮当前节点
    const nodeGroup = container.querySelector(`.node-group[data-lesson-id="${lessonId}"]`);
    if (nodeGroup) {
      nodeGroup.classList.add('highlighted');
      const rect = nodeGroup.querySelector('rect');
      if (rect) {
        rect.setAttribute('stroke', '#FFD700');
        rect.setAttribute('stroke-width', '4');
      }
    }
  },

  // 清除高亮
  clearHighlight(container) {
    container.querySelectorAll('.node-group').forEach(node => {
      node.classList.remove('highlighted');
      const rect = node.querySelector('rect');
      if (rect) {
        rect.setAttribute('stroke-width', '3');
        // 恢复原始边框色
        const lessonId = node.getAttribute('data-lesson-id');
        const progress = Storage.getLessonProgress(lessonId);
        const status = progress?.status || 'not-started';
        rect.setAttribute('stroke', this.getNodeStroke(status));
      }
    });
  }
};
