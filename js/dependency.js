// 依赖关系图可视化 - 力导向网状图 (Apple 风格)

const DependencyGraph = {
  // 配置
  config: {
    nodeWidth: 200,
    nodeHeight: 80,
    charge: -600,
    linkDistance: 200,
    padding: 100
  },

  // 渲染依赖图
  render(container) {
    console.log('依赖图渲染开始 (Apple 风格力导向图)...');

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

    this.renderForceDirectedGraph(container, nodes, edges);
  },

  // 构建图数据
  buildGraphData(chapters, dependencies) {
    const nodeMap = new Map();
    const edges = [];

    for (const chapter of chapters) {
      for (const lesson of (chapter.lessons || [])) {
        const progress = Storage.getLessonProgress(lesson.id);
        nodeMap.set(lesson.id, {
          id: lesson.id,
          title: lesson.title,
          chapter: chapter.title,
          chapterId: chapter.id,
          status: progress?.status || 'not-started',
          x: (Math.random() - 0.5) * 400,
          y: (Math.random() - 0.5) * 400
        });
      }
    }

    for (const dep of dependencies) {
      if (nodeMap.has(dep.from) && nodeMap.has(dep.to)) {
        edges.push({
          source: dep.from,
          target: dep.to
        });
      }
    }

    return { nodes: Array.from(nodeMap.values()), edges };
  },

  // 渲染力导向图
  renderForceDirectedGraph(container, nodes, edges) {
    const width = container.clientWidth || window.innerWidth - 40;
    const height = container.clientHeight || window.innerHeight - 200;

    container.innerHTML = '';

    // 控制栏
    const controls = document.createElement('div');
    controls.className = 'dependency-controls';
    controls.innerHTML = `
      <button id="dep-zoom-in" class="control-btn" title="放大">+</button>
      <button id="dep-zoom-out" class="control-btn" title="缩小">−</button>
      <button id="dep-reset" class="control-btn" title="重置">⟲</button>
      <span class="control-hint">💡 拖拽平移 / 滚轮缩放 / 点击课程</span>
    `;
    container.appendChild(controls);

    // SVG 容器
    const svgContainer = document.createElement('div');
    svgContainer.className = 'svg-viewport';
    svgContainer.innerHTML = `
      <svg class="dependency-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="24" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#999" />
          </marker>
        </defs>
        <g class="graph-content" transform="translate(${width/2}, ${height/2})">
          <g class="edges-group"></g>
          <g class="nodes-group"></g>
        </g>
      </svg>
    `;
    container.appendChild(svgContainer);

    const graphContent = svgContainer.querySelector('.graph-content');
    const edgesGroup = svg.querySelector('.edges-group');
    const nodesGroup = svgContainer.querySelector('.nodes-group');
    const svg = svgContainer.querySelector('.dependency-svg');

    // 创建边
    edges.forEach(edge => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('class', 'edge');
      line.setAttribute('stroke', 'var(--border)');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('marker-end', 'url(#arrowhead)');
      edgesGroup.appendChild(line);
    });

    // 创建节点
    const config = this.config;
    nodes.forEach(node => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'node-group');
      g.setAttribute('data-lesson-id', node.id);
      g.setAttribute('transform', `translate(${node.x}, ${node.y})`);

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('class', 'node-rect');
      rect.setAttribute('width', config.nodeWidth);
      rect.setAttribute('height', config.nodeHeight);
      rect.setAttribute('rx', '14');
      rect.setAttribute('ry', '14');
      rect.setAttribute('fill', 'var(--bg-secondary)');
      rect.setAttribute('stroke', this.getNodeStroke(node.status));
      rect.setAttribute('stroke-width', '2.5');
      rect.setAttribute('x', -config.nodeWidth / 2);
      rect.setAttribute('y', -config.nodeHeight / 2);

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      title.setAttribute('class', 'node-title');
      title.setAttribute('text-anchor', 'middle');
      title.setAttribute('fill', 'var(--text-primary)');
      title.setAttribute('font-size', '13');
      title.setAttribute('y', '-8');
      let displayTitle = node.title.length > 22 ? node.title.substring(0, 20) + '...' : node.title;
      title.textContent = displayTitle;

      const chapter = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      chapter.setAttribute('class', 'node-chapter');
      chapter.setAttribute('text-anchor', 'middle');
      chapter.setAttribute('fill', 'var(--text-secondary)');
      chapter.setAttribute('font-size', '11');
      chapter.setAttribute('y', '12');
      chapter.textContent = node.chapter;

      const statusDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      statusDot.setAttribute('r', '7');
      statusDot.setAttribute('cx', config.nodeWidth / 2 - 12);
      statusDot.setAttribute('cy', -config.nodeHeight / 2 + 12);
      statusDot.setAttribute('fill', this.getStatusColor(node.status));

      g.appendChild(rect);
      g.appendChild(title);
      g.appendChild(chapter);
      g.appendChild(statusDot);
      nodesGroup.appendChild(g);
    });

    // 力导向模拟
    let iterations = 0;
    const maxIterations = 250;

    const simulate = () => {
      if (iterations >= maxIterations) return;
      iterations++;

      // 斥力
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i], n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = config.charge / (dist * dist);
          n1.x += (dx / dist) * force;
          n1.y += (dy / dist) * force;
          n2.x -= (dx / dist) * force;
          n2.y -= (dy / dist) * force;
        }
      }

      // 引力
      edges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (!source || !target) return;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - config.linkDistance) * 0.04;
        source.x += (dx / dist) * force;
        source.y += (dy / dist) * force;
        target.x -= (dx / dist) * force;
        target.y -= (dy / dist) * force;
      });

      // 边界
      const boundary = Math.min(width, height) / 2 - config.padding;
      nodes.forEach(node => {
        node.x = Math.max(-boundary, Math.min(boundary, node.x));
        node.y = Math.max(-boundary, Math.min(boundary, node.y));
      });

      this.updateView(nodes, edges, edgesGroup, nodesGroup);
      requestAnimationFrame(simulate);
    };

    simulate();

    // 绑定交互 - 支持平移、缩放、拖拽
    this.bindInteractions(container, svgContainer, graphContent, nodes, edges, config);
  },

  updateView(nodes, edges, edgesGroup, nodesGroup) {
    const edgeEls = edgesGroup.querySelectorAll('line');
    edges.forEach((edge, i) => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      if (source && target && edgeEls[i]) {
        edgeEls[i].setAttribute('x1', source.x);
        edgeEls[i].setAttribute('y1', source.y);
        edgeEls[i].setAttribute('x2', target.x);
        edgeEls[i].setAttribute('y2', target.y);
      }
    });

    const nodeEls = nodesGroup.querySelectorAll('.node-group');
    nodes.forEach((node, i) => {
      if (nodeEls[i]) {
        nodeEls[i].setAttribute('transform', `translate(${node.x}, ${node.y})`);
      }
    });
  },

  getNodeStroke(status) {
    const colors = {
      'not-started': 'var(--border)',
      'learning': 'var(--warning)',
      'completed': 'var(--success)',
      'mastered': 'var(--primary)'
    };
    return colors[status] || 'var(--border)';
  },

  getStatusColor(status) {
    const colors = {
      'not-started': 'var(--text-tertiary)',
      'learning': 'var(--warning)',
      'completed': 'var(--success)',
      'mastered': 'var(--primary)'
    };
    return colors[status] || 'var(--text-tertiary)';
  },

  bindInteractions(container, svgContainer, graphContent, nodes, edges, config) {
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isPanning = false;
    let startX, startY;
    let draggedNode = null;

    const updateTransform = () => {
      graphContent.setAttribute('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);
    };

    // 缩放控制
    document.getElementById('dep-zoom-in')?.addEventListener('click', () => {
      scale = Math.min(scale * 1.3, 4);
      updateTransform();
    });

    document.getElementById('dep-zoom-out')?.addEventListener('click', () => {
      scale = Math.max(scale / 1.3, 0.3);
      updateTransform();
    });

    document.getElementById('dep-reset')?.addEventListener('click', () => {
      scale = 1;
      translateX = 0;
      translateY = 0;
      updateTransform();
    });

    // 滚轮缩放
    svgContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1.1 : 0.9;
      scale = Math.max(0.3, Math.min(4, scale * delta));
      updateTransform();
    }, { passive: false });

    // 鼠标按下 - 开始平移或拖拽节点
    svgContainer.addEventListener('mousedown', (e) => {
      const nodeGroup = e.target.closest('.node-group');
      if (nodeGroup) {
        draggedNode = nodes.find(n => n.id === nodeGroup.getAttribute('data-lesson-id'));
        e.stopPropagation();
      } else {
        isPanning = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        svgContainer.style.cursor = 'grabbing';
      }
    });

    // 鼠标移动 - 平移或拖拽
    svgContainer.addEventListener('mousemove', (e) => {
      if (isPanning) {
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
      } else if (draggedNode) {
        const rect = svgContainer.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - svgContainer.clientWidth / 2 - translateX) / scale;
        const mouseY = (e.clientY - rect.top - svgContainer.clientHeight / 2 - translateY) / scale;
        draggedNode.x = mouseX;
        draggedNode.y = mouseY;
        this.updateView(nodes, edges, svgContainer.querySelector('.edges-group'), svgContainer.querySelector('.nodes-group'));
      }
    });

    // 鼠标松开
    svgContainer.addEventListener('mouseup', () => {
      isPanning = false;
      draggedNode = null;
      svgContainer.style.cursor = 'grab';
    });

    svgContainer.addEventListener('mouseleave', () => {
      isPanning = false;
      draggedNode = null;
      svgContainer.style.cursor = 'grab';
    });

    // 节点点击
    container.querySelectorAll('.node-group').forEach(group => {
      group.addEventListener('click', () => {
        const lessonId = group.getAttribute('data-lesson-id');
        if (lessonId && SkillTree?.openLesson) {
          SkillTree.openLesson(lessonId);
        }
      });
    });

    // 触摸支持
    let lastTouchDistance = null;
    let lastTouchX = 0;
    let lastTouchY = 0;

    svgContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        lastTouchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      } else if (e.touches.length === 1) {
        const nodeGroup = e.touches[0].target.closest('.node-group');
        if (!nodeGroup) {
          isPanning = true;
          lastTouchX = e.touches[0].clientX - translateX;
          lastTouchY = e.touches[0].clientY - translateY;
        }
      }
    }, { passive: true });

    svgContainer.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && lastTouchDistance) {
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const delta = distance / lastTouchDistance;
        scale = Math.max(0.3, Math.min(4, scale * delta));
        lastTouchDistance = distance;
        updateTransform();
        e.preventDefault();
      } else if (e.touches.length === 1 && isPanning) {
        translateX = e.touches[0].clientX - lastTouchX;
        translateY = e.touches[0].clientY - lastTouchY;
        updateTransform();
      }
    }, { passive: false });

    svgContainer.addEventListener('touchend', () => {
      isPanning = false;
      lastTouchDistance = null;
    });
  },

  clearHighlight(container) {
    container.querySelectorAll('.node-group').forEach(node => {
      node.classList.remove('highlighted');
      const rect = node.querySelector('rect');
      if (rect) {
        const lessonId = node.getAttribute('data-lesson-id');
        const progress = Storage.getLessonProgress(lessonId);
        const status = progress?.status || 'not-started';
        rect.setAttribute('stroke', this.getNodeStroke(status));
        rect.setAttribute('stroke-width', '2.5');
      }
    });
  }
};
