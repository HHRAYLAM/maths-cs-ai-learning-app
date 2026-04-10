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
    const width = Math.max(container.clientWidth || 800, 800);
    const height = Math.max(container.clientHeight || 600, 600);

    container.innerHTML = '';

    // 控制栏
    const controls = document.createElement('div');
    controls.className = 'dependency-controls';
    controls.innerHTML = `
      <button id="dep-zoom-in" class="control-btn" title="放大">+</button>
      <button id="dep-zoom-out" class="control-btn" title="缩小">−</button>
      <button id="dep-reset" class="control-btn" title="重置">⟲</button>
      <span class="control-hint">💡 拖拽 / 滚轮缩放 / 点击课程</span>
    `;
    container.appendChild(controls);

    // 创建 SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'dependency-svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // 创建 defs
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="24" refY="3" orient="auto">
        <polygon points="0 0, 10 3, 0 6" fill="#999" />
      </marker>
    `;
    svg.appendChild(defs);

    // 创建主分组
    const graphContent = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    graphContent.setAttribute('class', 'graph-content');
    graphContent.setAttribute('transform', `translate(${width/2}, ${height/2})`);

    const edgesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    edgesGroup.setAttribute('class', 'edges-group');

    const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodesGroup.setAttribute('class', 'nodes-group');

    graphContent.appendChild(edgesGroup);
    graphContent.appendChild(nodesGroup);
    svg.appendChild(graphContent);

    // 创建可拖拽的背景
    const panBg = document.createElement('div');
    panBg.style.cssText = 'position:absolute;inset:0;z-index:1;cursor:grab;';
    container.appendChild(panBg);
    container.style.position = 'relative';

    container.appendChild(svg);

    const config = this.config;

    // 创建边
    edges.forEach(edge => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('class', 'edge');
      line.setAttribute('stroke', '#ccc');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('fill', 'none');
      line.setAttribute('marker-end', 'url(#arrowhead)');
      edgesGroup.appendChild(line);
    });

    // 创建节点
    nodes.forEach(node => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'node-group');
      g.setAttribute('data-lesson-id', node.id);
      g.setAttribute('transform', `translate(${node.x}, ${node.y})`);
      g.style.cursor = 'pointer';

      // 节点背景
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', config.nodeWidth);
      rect.setAttribute('height', config.nodeHeight);
      rect.setAttribute('rx', '14');
      rect.setAttribute('ry', '14');
      rect.setAttribute('fill', '#fff');
      rect.setAttribute('stroke', this.getNodeStroke(node.status));
      rect.setAttribute('stroke-width', '2.5');
      rect.setAttribute('x', -config.nodeWidth / 2);
      rect.setAttribute('y', -config.nodeHeight / 2);

      // 标题
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      title.setAttribute('text-anchor', 'middle');
      title.setAttribute('fill', '#1d1d1f');
      title.setAttribute('font-size', '12');
      title.setAttribute('font-weight', '600');
      title.setAttribute('y', '-5');
      let displayTitle = node.title.length > 20 ? node.title.substring(0, 18) + '...' : node.title;
      title.textContent = displayTitle;

      // 章节
      const chapter = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      chapter.setAttribute('text-anchor', 'middle');
      chapter.setAttribute('fill', '#6e6e73');
      chapter.setAttribute('font-size', '11');
      chapter.setAttribute('y', '14');
      chapter.textContent = node.chapter;

      // 状态点
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
    const maxIterations = 200;

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
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          n1.x += fx;
          n1.y += fy;
          n2.x -= fx;
          n2.y -= fy;
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
        const force = (dist - config.linkDistance) * 0.03;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        source.x += fx;
        source.y += fy;
        target.x -= fx;
        target.y -= fy;
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

    // 交互
    this.bindInteractions(container, panBg, graphContent, nodes, edges);
  },

  updateView(nodes, edges, edgesGroup, nodesGroup) {
    // 更新边
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

    // 更新节点
    const nodeEls = nodesGroup.querySelectorAll('.node-group');
    nodes.forEach((node, i) => {
      if (nodeEls[i]) {
        nodeEls[i].setAttribute('transform', `translate(${node.x}, ${node.y})`);
      }
    });
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

  bindInteractions(container, panBg, graphContent, nodes, edges) {
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isPanning = false;
    let startX, startY;
    let draggedNode = null;

    const svg = container.querySelector('svg');
    const edgesGroup = svg.querySelector('.edges-group');
    const nodesGroup = svg.querySelector('.nodes-group');

    const updateTransform = () => {
      graphContent.setAttribute('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);
    };

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

    // 背景拖拽平移
    panBg.addEventListener('mousedown', (e) => {
      if (e.target === panBg || e.target.classList.contains('dependency-svg')) {
        isPanning = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        panBg.style.cursor = 'grabbing';
      }
    });

    // 节点拖拽
    svg.addEventListener('mousedown', (e) => {
      const nodeGroup = e.target.closest('.node-group');
      if (nodeGroup) {
        draggedNode = nodes.find(n => n.id === nodeGroup.getAttribute('data-lesson-id'));
        e.stopPropagation();
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (isPanning) {
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
      } else if (draggedNode) {
        const rect = svg.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        draggedNode.x = (e.clientX - cx - translateX) / scale;
        draggedNode.y = (e.clientY - cy - translateY) / scale;
        this.updateView(nodes, edges, edgesGroup, nodesGroup);
      }
    });

    window.addEventListener('mouseup', () => {
      isPanning = false;
      draggedNode = null;
      panBg.style.cursor = 'grab';
    });

    // 节点点击
    nodesGroup.querySelectorAll('.node-group').forEach(group => {
      group.addEventListener('click', () => {
        const lessonId = group.getAttribute('data-lesson-id');
        if (lessonId && window.SkillTree?.openLesson) {
          SkillTree.openLesson(lessonId);
        }
      });
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
