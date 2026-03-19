// Markdown编辑器脚本

let currentMarkdown = '';
let currentTitle = '';
let drafts = [];

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
  // 加载当前内容
  const storage = await chrome.storage.local.get([
    'currentMarkdown', 
    'currentTitle', 
    'currentUrl',
    'drafts'
  ]);
  
  if (storage.currentMarkdown) {
    currentMarkdown = storage.currentMarkdown;
    document.getElementById('editor').value = currentMarkdown;
    
    // 从markdown中提取标题
    const titleMatch = currentMarkdown.match(/^title:\s*(.+)$/m);
    if (titleMatch) {
      document.getElementById('filename').value = sanitizeFilename(titleMatch[1]);
    }
  }
  
  if (storage.drafts) {
    drafts = storage.drafts;
  }
  
  // 检查URL参数
  const params = new URLSearchParams(window.location.search);
  if (params.get('view') === 'drafts') {
    showDraftsModal();
  }
  
  // 初始化预览
  updatePreview();
  
  // 设置编辑器事件
  setupEditor();
});

// 设置编辑器
function setupEditor() {
  const editor = document.getElementById('editor');
  
  // 实时预览
  editor.addEventListener('input', () => {
    currentMarkdown = editor.value;
    updatePreview();
  });
  
  // 工具栏按钮
  document.querySelectorAll('.toolbar button').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      insertMarkdown(action);
    });
  });
  
  // 保存草稿
  document.getElementById('saveDraft').addEventListener('click', saveDraft);
  
  // 下载
  document.getElementById('download').addEventListener('click', downloadMarkdown);
  
  // 发布到GitHub
  document.getElementById('publishGithub').addEventListener('click', showPublishModal);
  
  // 模态框关闭按钮
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal').classList.remove('show');
    });
  });
  
  // 确认发布
  document.getElementById('confirmPublish').addEventListener('click', publishToGithub);
  
  // 点击模态框背景关闭
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  });
}

// 更新预览
function updatePreview() {
  const markdown = document.getElementById('editor').value;
  const html = renderMarkdown(markdown);
  document.getElementById('preview').innerHTML = html;
}

// 简单的Markdown渲染器
function renderMarkdown(markdown) {
  let html = markdown
    // 代码块
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // 行内代码
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 标题
    .replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
    // 粗体和斜体
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // 链接和图片
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    // 引用
    .replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')
    // 水平线
    .replace(/^---$/gm, '<hr>')
    .replace(/^\*\*\*$/gm, '<hr>')
    // 列表
    .replace(/^\*\s+(.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\.\s+(.+)$/gm, '<li>$2</li>')
    // 段落
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  
  // 包裹列表
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  html = html.replace(/<\/ul><ul>/g, '');
  
  // 移除空的YAML前置元数据
  html = html.replace(/---[\s\S]*?---/, '');
  
  return '<p>' + html + '</p>';
}

// 插入Markdown语法
function insertMarkdown(action) {
  const editor = document.getElementById('editor');
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const text = editor.value;
  const selected = text.substring(start, end);
  
  let insert = '';
  let cursorOffset = 0;
  
  switch (action) {
    case 'bold':
      insert = `**${selected || '粗体文字'}**`;
      cursorOffset = selected ? insert.length : 2;
      break;
    case 'italic':
      insert = `*${selected || '斜体文字'}*`;
      cursorOffset = selected ? insert.length : 1;
      break;
    case 'code':
      insert = `\`${selected || '代码'}\``;
      cursorOffset = selected ? insert.length : 1;
      break;
    case 'link':
      insert = `[${selected || '链接文字'}](url)`;
      cursorOffset = selected ? insert.length - 4 : 1;
      break;
    case 'image':
      insert = `![${selected || '图片描述'}](url)`;
      cursorOffset = selected ? insert.length - 4 : 2;
      break;
    case 'heading':
      insert = `## ${selected || '标题'}`;
      cursorOffset = selected ? insert.length : 3;
      break;
    case 'quote':
      insert = `> ${selected || '引用文字'}`;
      cursorOffset = selected ? insert.length : 2;
      break;
    case 'list':
      insert = `- ${selected || '列表项'}`;
      cursorOffset = selected ? insert.length : 2;
      break;
  }
  
  editor.value = text.substring(0, start) + insert + text.substring(end);
  editor.focus();
  editor.setSelectionRange(start + cursorOffset, start + cursorOffset);
  updatePreview();
}

// 保存草稿
async function saveDraft() {
  const filename = document.getElementById('filename').value || '未命名';
  const content = document.getElementById('editor').value;
  
  const draft = {
    id: Date.now(),
    title: filename,
    content: content,
    date: new Date().toISOString()
  };
  
  // 检查是否已存在同名草稿
  const existingIndex = drafts.findIndex(d => d.title === filename);
  if (existingIndex !== -1) {
    drafts[existingIndex] = draft;
  } else {
    drafts.unshift(draft);
  }
  
  await chrome.storage.local.set({ drafts: drafts });
  
  alert('草稿已保存！');
}

// 下载Markdown文件
function downloadMarkdown() {
  const filename = (document.getElementById('filename').value || 'document') + '.md';
  const content = document.getElementById('editor').value;
  
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(url);
}

// 显示发布模态框
function showPublishModal() {
  const modal = document.getElementById('publishModal');
  const filename = document.getElementById('filename').value || 'document';
  
  document.getElementById('githubPath').value = `${filename}.md`;
  document.getElementById('commitMessage').value = `添加/更新: ${filename}`;
  
  modal.classList.add('show');
}

// 发布到GitHub
async function publishToGithub() {
  const status = document.getElementById('publishStatus');
  status.className = 'loading';
  status.textContent = '正在发布...';
  
  try {
    const config = await chrome.storage.local.get([
      'githubToken',
      'githubUsername',
      'githubRepo'
    ]);
    
    if (!config.githubToken || !config.githubUsername || !config.githubRepo) {
      status.className = 'error';
      status.textContent = '请先在扩展弹出窗口中配置GitHub信息';
      return;
    }
    
    const path = document.getElementById('githubPath').value;
    const message = document.getElementById('commitMessage').value;
    const content = document.getElementById('editor').value;
    
    // 编码为Base64
    const encodedContent = btoa(unescape(encodeURIComponent(content)));
    
    // 检查文件是否存在
    const apiUrl = `https://api.github.com/repos/${config.githubUsername}/${config.githubRepo}/contents/${path}`;
    
    let sha = null;
    try {
      const existingFile = await fetch(apiUrl, {
        headers: {
          'Authorization': `token ${config.githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (existingFile.ok) {
        const data = await existingFile.json();
        sha = data.sha;
      }
    } catch (e) {
      // 文件不存在，继续创建
    }
    
    // 创建或更新文件
    const body = {
      message: message,
      content: encodedContent,
      branch: 'main'
    };
    
    if (sha) {
      body.sha = sha;
    }
    
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${config.githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (response.ok) {
      const data = await response.json();
      status.className = 'success';
      status.innerHTML = `发布成功！<br><a href="https://github.com/${config.githubUsername}/${config.githubRepo}/blob/main/${path}" target="_blank">查看文件</a>`;
    } else {
      const error = await response.json();
      status.className = 'error';
      status.textContent = `发布失败: ${error.message || '未知错误'}`;
    }
  } catch (error) {
    status.className = 'error';
    status.textContent = `发布失败: ${error.message}`;
  }
}

// 显示草稿列表
function showDraftsModal() {
  const modal = document.getElementById('draftsModal');
  const list = document.getElementById('draftsList');
  
  if (drafts.length === 0) {
    list.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">暂无草稿</p>';
  } else {
    list.innerHTML = drafts.map(draft => `
      <div class="draft-item" data-id="${draft.id}">
        <div class="draft-info">
          <div class="draft-title">${draft.title}</div>
          <div class="draft-date">${new Date(draft.date).toLocaleString('zh-CN')}</div>
        </div>
        <div class="draft-actions">
          <button class="load-btn" data-id="${draft.id}">加载</button>
          <button class="delete-btn" data-id="${draft.id}">删除</button>
        </div>
      </div>
    `).join('');
    
    // 绑定加载和删除事件
    list.querySelectorAll('.load-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        loadDraft(parseInt(btn.dataset.id));
        modal.classList.remove('show');
      });
    });
    
    list.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('确定删除此草稿？')) {
          await deleteDraft(parseInt(btn.dataset.id));
          showDraftsModal();
        }
      });
    });
  }
  
  modal.classList.add('show');
}

// 加载草稿
function loadDraft(id) {
  const draft = drafts.find(d => d.id === id);
  if (draft) {
    document.getElementById('filename').value = draft.title;
    document.getElementById('editor').value = draft.content;
    currentMarkdown = draft.content;
    updatePreview();
  }
}

// 删除草稿
async function deleteDraft(id) {
  drafts = drafts.filter(d => d.id !== id);
  await chrome.storage.local.set({ drafts: drafts });
}

// 工具函数
function sanitizeFilename(title) {
  return title
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .substring(0, 100);
}
