// 依赖关系图可视化组件 - SVG 力导向布局

const DependencyGraph = {
  // 配置
  config: {
    nodeWidth: 180,
    nodeHeight: 80,
    layerHeight: 120,
    padding: 40
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

    // 构建节点和边数据
    const { nodes, edges } = this.buildGraphData(chapters, dependencies);

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

    // 计算节点位置（分层布局）
    const layers = this.calculateLayers(nodes, edges);

    // 渲染 SVG
    this.renderSVG(container, nodes, edges, layers);

    // 绑定交互事件
    this.bindEvents(container, nodes);
  },

  // 构建图数据
  buildGraphData(chapters, dependencies) {
    const nodeMap = new Map();
    const edges = [];

    // 收集所有节点
    for (const chapter of chapters) {
      for (const lesson of (chapter.lessons || [])) {
        const progress = Storage.getLessonProgress(lesson.id);
        nodeMap.set(lesson.id, {
          id: lesson.id,
          title: lesson.title,
          chapter: chapter.title,
          chapterId: chapter.id,
          status: progress?.status || 'not-started',
          percent: progress?.percent || 0,
          inDegree: 0,  // 先修课程数量
          outDegree: 0  // 依赖此课程的數量
        });
      }
    }

    // 构建边
    for (const dep of dependencies) {
      const source = nodeMap.get(dep.from);
      const target = nodeMap.get(dep.to);
      if (source && target) {
        edges.push({
          id: `${dep.from}-${dep.to}`,
          source: dep.from,
          target: dep.to,
          sourceChapter: dep.fromChapter,
          targetChapter: dep.toChapter
        });
        source.outDegree++;
        target.inDegree++;
      }
    }

    return {
      nodes: Array.from(nodeMap.values()),
      edges
    };
  },

  // 计算分层布局
  calculateLayers(nodes, edges) {
    // 计算每个节点的层级（基于最长路径）
    const levelMap = new Map();
    const visited = new Set();

    // DFS 计算层级
    const dfs = (nodeId, depth) => {
      if (visited.has(nodeId)) {
        levelMap.set(nodeId, Math.max(levelMap.get(nodeId) || 0, depth));
        return;
      }
      visited.add(nodeId);
      levelMap.set(nodeId, depth);

      // 找出所有依赖此节点的节点
      edges.forEach(edge => {
        if (edge.source === nodeId) {
          dfs(edge.target, depth + 1);
        }
      });
    };

    // 从入度为 0 的节点开始（根节点）
    nodes.forEach(node => {
      if (node.inDegree === 0) {
        dfs(node.id, 0);
      }
    });

    // 处理未访问的节点（可能是孤立节点）
    nodes.forEach(node => {
      if (!levelMap.has(node.id)) {
        levelMap.set(node.id, 0);
      }
    });

    // 按层级分组
    const layers = new Map();
    nodes.forEach(node => {
      const level = levelMap.get(node.id);
      if (!layers.has(level)) {
        layers.set(level, []);
      }
      layers.get(level).push(node);
    });

    return {
      layers,
      levelMap,
      maxLevel: Math.max(...levelMap.values())
    };
  },

  // 渲染 SVG
  renderSVG(container, nodes, edges, layersData) {
    const { layers, levelMap, maxLevel } = layersData;
    const config = this.config;

    // 计算 SVG 尺寸
    const maxNodesInLayer = Math.max(...Array.from(layers.values()).map(l => l.length));
    const svgWidth = Math.max(800, maxNodesInLayer * (config.nodeWidth + 20) + config.padding * 2);
    const svgHeight = (maxLevel + 1) * config.layerHeight + config.padding * 2;

    // 计算每个节点的位置
    const nodePositions = new Map();
    layers.forEach((layerNodes, level) => {
      const layerWidth = layerNodes.length * (config.nodeWidth + 20);
      const startX = (svgWidth - layerWidth) / 2;

      layerNodes.forEach((node, index) => {
        nodePositions.set(node.id, {
          x: startX + index * (config.nodeWidth + 20) + config.nodeWidth / 2,
          y: level * config.layerHeight + config.padding + config.layerHeight / 2
        });
      });
    });

    // 生成层级颜色
    const layerColors = ['#4A90D9', '#9B59B6', '#2ECC71', '#E67E22', '#E74C3C', '#1ABC9C'];

    // 构建 SVG 内容
    let svgContent = `
      <svg class="dependency-svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#999" />
          </marker>
          <marker id="arrowhead-highlight" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#4A90D9" />
          </marker>
          <!-- 渐变定义 -->
          ${nodes.map(node => `
            <linearGradient id="grad-${node.id}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${this.getNodeColor(node.status, true)}" />
              <stop offset="100%" style="stop-color:${this.getNodeColor(node.status, false)}" />
            </linearGradient>
          `).join('')}
        </defs>

        <!-- 边（连接线） -->
        <g class="edges">
          ${edges.map(edge => {
            const source = nodePositions.get(edge.source);
            const target = nodePositions.get(edge.target);
            if (!source || !target) return '';

            const dx = target.x - source.x;
            const dy = target.y - source.y - config.layerHeight / 2;

            // 贝塞尔曲线
            const path = `M ${source.x} ${source.y + 30} C ${source.x} ${source.y + 50}, ${target.x} ${target.y - 50}, ${target.x} ${target.y - 30}`;

            return `
              <g class="edge-group" data-source="${edge.source}" data-target="${edge.target}">
                <path class="edge-path" d="${path}" stroke="#ddd" stroke-width="2" fill="none" marker-end="url(#arrowhead)" />
                <title>${edge.sourceChapter} → ${edge.targetChapter}</title>
              </g>
            `;
          }).join('')}
        </g>

        <!-- 节点 -->
        <g class="nodes">
          ${nodes.map(node => {
            const pos = nodePositions.get(node.id);
            if (!pos) return '';

            const level = levelMap.get(node.id);
            const color = layerColors[level % layerColors.length];
            const status = node.status;
            const statusIcon = status === 'completed' ? '✓' : status === 'mastered' ? '★' : status === 'learning' ? '◐' : '○';

            return `
              <g class="node-group" data-lesson-id="${node.id}" transform="translate(${pos.x - config.nodeWidth / 2}, ${pos.y - config.nodeHeight / 2})" style="cursor: pointer;">
                <!-- 节点背景 -->
                <rect class="node-rect"
                      x="0" y="0"
                      width="${config.nodeWidth}" height="${config.nodeHeight}"
                      rx="10" ry="10"
                      fill="url(#grad-${node.id})"
                      stroke="${color}"
                      stroke-width="3" />

                <!-- 状态图标 -->
                <circle cx="20" cy="20" r="12" fill="white" opacity="0.9" />
                <text x="20" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="${this.getStatusColor(status)}">${statusIcon}</text>

                <!-- 课程标题 -->
                <text x="45" y="25" font-size="13" font-weight="500" fill="white" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
                  ${this.escapeXml(node.title)}
                </text>

                <!-- 章节名称 -->
                <text x="45" y="45" font-size="11" fill="rgba(255,255,255,0.85);">
                  📚 ${this.escapeXml(node.chapter)}
                </text>

                <!-- 依赖信息 -->
                <text x="${config.nodeWidth - 10}" y="65" text-anchor="end" font-size="10" fill="rgba(255,255,255,0.9);">
                  🔗 ${node.outDegree} 依赖
                </text>

                <!-- 进度条 -->
                ${status === 'completed' || status === 'mastered' ? `
                  <rect x="10" y="60" width="${config.nodeWidth - 20}" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
                  <rect x="10" y="60" width="${(config.nodeWidth - 20) * (node.percent / 100)}" height="6" rx="3" fill="#58CC02" />
                ` : ''}

                <title>${node.title}
  章节：${node.chapter}
  状态：${this.getStatusText(status)}
  依赖数：${node.outDegree}</title>
              </g>
            `;
          }).join('')}
        </g>
      </svg>

      <!-- 图例 -->
      <div class="dependency-legend">
        <div class="legend-item">
          <div class="legend-dot" style="background: #4A90D9;"></div>
          <span>第 1 层（基础）</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background: #9B59B6;"></div>
          <span>第 2 层</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background: #2ECC71;"></div>
          <span>第 3 层</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background: #E67E22;"></div>
          <span>第 4 层</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background: #E74C3C;"></div>
          <span>第 5 层+（高级）</span>
        </div>
        <div class="legend-item">
          <span>○ 未开始</span>
        </div>
        <div class="legend-item">
          <span>◐ 学习中</span>
        </div>
        <div class="legend-item">
          <span>✓ 已完成</span>
        </div>
        <div class="legend-item">
          <span>★ 已精通</span>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="dependency-controls">
        <button class="control-btn" id="dep-zoom-in" title="放大">🔍 +</button>
        <button class="control-btn" id="dep-zoom-out" title="缩小">🔍 -</button>
        <button class="control-btn" id="dep-reset" title="重置视图">⟲ 重置</button>
      </div>
    `;

    container.innerHTML = svgContent;

    // 存储位置数据供后续使用
    this.currentPositions = nodePositions;
    this.currentEdges = edges;
    this.currentNodes = nodes;
  },

  // 绑定交互事件
  bindEvents(container, nodes) {
    // 节点点击事件
    container.querySelectorAll('.node-group').forEach(group => {
      group.addEventListener('click', () => {
        const lessonId = group.dataset.lessonId;
        if (lessonId) {
          this.highlightPath(lessonId);
          // 3 秒后可以直接进入课程
          setTimeout(() => {
            const goToLesson = confirm('是否进入此课程学习？');
            if (goToLesson) {
              SkillTree.openLesson(lessonId);
            }
          }, 500);
        }
      });
    });

    // 缩放控制
    let scale = 1;
    const svg = container.querySelector('.dependency-svg');

    document.getElementById('dep-zoom-in')?.addEventListener('click', () => {
      scale = Math.min(scale * 1.2, 3);
      svg.style.transform = `scale(${scale})`;
    });

    document.getElementById('dep-zoom-out')?.addEventListener('click', () => {
      scale = Math.max(scale / 1.2, 0.5);
      svg.style.transform = `scale(${scale})`;
    });

    document.getElementById('dep-reset')?.addEventListener('click', () => {
      scale = 1;
      svg.style.transform = 'scale(1)';
      this.clearHighlight();
    });

    // 点击空白处清除高亮
    container.addEventListener('click', (e) => {
      if (e.target === container || e.target.classList.contains('dependency-container')) {
        this.clearHighlight();
      }
    });
  },

  // 获取节点颜色
  getNodeColor(status, isStart) {
    const colors = {
      'not-started': isStart ? '#667eea' : '#764ba2',
      'learning': isStart ? '#f6d365' : '#fda085',
      'completed': isStart ? '#56ab2f' : '#a8e063',
      'mastered': isStart ? '#667eea' : '#764ba2'
    };
    return colors[status] || colors['not-started'];
  },

  // 获取状态颜色
  getStatusColor(status) {
    const colors = {
      'not-started': '#999',
      'learning': '#f39c12',
      'completed': '#27ae60',
      'mastered': '#9b59b6'
    };
    return colors[status] || '#999';
  },

  // 获取状态文本
  getStatusText(status) {
    const texts = {
      'not-started': '未开始',
      'learning': '学习中',
      'completed': '已完成',
      'mastered': '已精通'
    };
    return texts[status] || '未知';
  },

  // XML 转义
  escapeXml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  },

  // 高亮依赖路径
  highlightPath(lessonId) {
    const container = document.querySelector('.dependency-container');
    if (!container) return;

    // 清除之前的高亮
    this.clearHighlight();

    // 获取完整依赖树
    const fullPrereqs = Content.getFullPrerequisites(lessonId);
    const allIds = [lessonId, ...fullPrereqs.map(p => p.id)];

    // 高亮节点
    allIds.forEach(id => {
      const node = container.querySelector(`.node-group[data-lesson-id="${id}"]`);
      if (node) {
        node.classList.add('highlighted');
        const rect = node.querySelector('.node-rect');
        if (rect) {
          rect.setAttribute('stroke', '#FFD700');
          rect.setAttribute('stroke-width', '5');
        }
      }
    });

    // 高亮边
    const edges = container.querySelectorAll('.edge-group');
    edges.forEach(edge => {
      const source = edge.dataset.source;
      const target = edge.dataset.target;
      if (allIds.includes(target)) {
        const path = edge.querySelector('.edge-path');
        if (path) {
          path.setAttribute('stroke', '#4A90D9');
          path.setAttribute('stroke-width', '3');
          path.setAttribute('marker-end', 'url(#arrowhead-highlight)');
        }
      }
    });

    showToast(`已高亮 ${allIds.length} 个相关课程`);
  },

  // 清除高亮
  clearHighlight() {
    const container = document.querySelector('.dependency-container');
    if (!container) return;

    // 重置节点
    container.querySelectorAll('.node-group').forEach(node => {
      node.classList.remove('highlighted');
      const rect = node.querySelector('.node-rect');
      if (rect) {
        // 恢复原始样式
        rect.setAttribute('stroke-width', '3');
      }
    });

    // 重置边
    container.querySelectorAll('.edge-path').forEach(path => {
      path.setAttribute('stroke', '#ddd');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('marker-end', 'url(#arrowhead)');
    });
  }
};

window.DependencyGraph = DependencyGraph;
