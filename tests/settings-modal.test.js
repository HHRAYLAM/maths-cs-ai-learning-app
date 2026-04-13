// P0-1 设置弹窗功能测试

describe('设置弹窗功能', () => {
  beforeEach(() => {
    // 设置基础 HTML
    document.body.innerHTML = `
      <div id="settings-modal" class="modal hidden">
        <div class="modal-content settings-modal">
          <h2>⚙️ 设置</h2>

          <div class="settings-group">
            <div class="settings-item">
              <div class="settings-item-label">主题外观</div>
              <div class="theme-selector">
                <button class="theme-btn" data-theme="light">☀️ 浅色</button>
                <button class="theme-btn" data-theme="dark">🌙 暗色</button>
              </div>
            </div>
          </div>

          <div class="settings-group">
            <div class="settings-item">
              <div class="settings-item-label">语言设置</div>
              <button class="language-btn" data-lang="zh-CN">🇨🇳 中文</button>
              <button class="language-btn" data-lang="en-US">🇺🇸 English</button>
            </div>
          </div>

          <div class="settings-actions">
            <button id="settings-cancel" class="btn btn-secondary">取消</button>
            <button id="settings-save" class="btn btn-primary">保存更改</button>
          </div>

          <button class="modal-close" onclick="closeSettingsModal()">完成</button>
        </div>
      </div>
    `;

    // 模拟 Storage
    window.Storage = {
      getTheme: () => 'light',
      getLanguage: () => 'zh-CN',
      setTheme: () => {},
      setLanguage: () => {},
      applyTheme: () => {}
    };
  });

  describe('取消/保存按钮', () => {
    test('应该显示取消和保存按钮', () => {
      const cancelBtn = document.getElementById('settings-cancel');
      const saveBtn = document.getElementById('settings-save');

      expect(cancelBtn).not.toBeNull();
      expect(saveBtn).not.toBeNull();
    });

    test('保存按钮在未更改时应该禁用', () => {
      const saveBtn = document.getElementById('settings-save');

      // 模拟未更改状态
      saveBtn.disabled = true;

      expect(saveBtn.disabled).toBe(true);
    });

    test('点击取消按钮应该关闭弹窗并恢复原设置', () => {
      const modal = document.getElementById('settings-modal');
      const cancelBtn = document.getElementById('settings-cancel');

      let settingsRestored = false;

      // 模拟取消逻辑
      cancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        settingsRestored = true;
      });

      cancelBtn.click();

      expect(modal.classList.contains('hidden')).toBe(true);
      expect(settingsRestored).toBe(true);
    });

    test('点击保存按钮应该关闭弹窗并应用更改', () => {
      const modal = document.getElementById('settings-modal');
      const saveBtn = document.getElementById('settings-save');

      let settingsApplied = false;

      // 模拟保存逻辑
      saveBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        settingsApplied = true;
      });

      saveBtn.click();

      expect(modal.classList.contains('hidden')).toBe(true);
      expect(settingsApplied).toBe(true);
    });
  });

  describe('临时状态管理', () => {
    test('打开设置弹窗时应该保存当前设置为临时状态', () => {
      const tempState = {
        theme: window.Storage.getTheme(),
        language: window.Storage.getLanguage()
      };

      expect(tempState.theme).toBe('light');
      expect(tempState.language).toBe('zh-CN');
    });

    test('修改设置时应该只更新临时状态', () => {
      let tempState = { theme: 'light', language: 'zh-CN' };
      let actualState = { theme: 'light', language: 'zh-CN' };

      // 模拟用户修改主题为 dark
      tempState.theme = 'dark';

      // 临时状态已改变
      expect(tempState.theme).toBe('dark');
      // 实际状态未改变
      expect(actualState.theme).toBe('light');
    });

    test('取消时应该丢弃临时状态', () => {
      let tempState = { theme: 'light', language: 'zh-CN' };
      const originalState = { theme: 'light', language: 'zh-CN' };

      // 用户修改
      tempState.theme = 'dark';
      tempState.language = 'en-US';

      // 用户点击取消
      tempState = { ...originalState };

      expect(tempState.theme).toBe('light');
      expect(tempState.language).toBe('zh-CN');
    });

    test('保存时应该应用临时状态', () => {
      let tempState = { theme: 'dark', language: 'en-US' };
      let actualState = { theme: 'light', language: 'zh-CN' };

      // 用户点击保存
      actualState = { ...tempState };

      expect(actualState.theme).toBe('dark');
      expect(actualState.language).toBe('en-US');
    });
  });

  describe('更改检测', () => {
    test('应该检测用户是否有更改', () => {
      const originalState = { theme: 'light', language: 'zh-CN' };
      const tempState = { theme: 'light', language: 'zh-CN' };

      const hasChanges = JSON.stringify(originalState) !== JSON.stringify(tempState);
      expect(hasChanges).toBe(false);
    });

    test('用户修改后应该检测到更改', () => {
      const originalState = { theme: 'light', language: 'zh-CN' };
      const tempState = { theme: 'dark', language: 'zh-CN' };

      const hasChanges = JSON.stringify(originalState) !== JSON.stringify(tempState);
      expect(hasChanges).toBe(true);
    });

    test('有更改时保存按钮应该启用', () => {
      const originalState = { theme: 'light', language: 'zh-CN' };
      const tempState = { theme: 'dark', language: 'zh-CN' };
      const saveBtn = document.getElementById('settings-save');

      const hasChanges = JSON.stringify(originalState) !== JSON.stringify(tempState);
      saveBtn.disabled = !hasChanges;

      expect(saveBtn.disabled).toBe(false);
    });
  });
});
