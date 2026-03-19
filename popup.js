// 弹出窗口脚本

document.addEventListener('DOMContentLoaded', async () => {
  // 加载已保存的配置
  const config = await chrome.storage.local.get(['githubToken', 'githubUsername', 'githubRepo']);
  
  if (config.githubToken) {
    document.getElementById('token').value = config.githubToken;
  }
  if (config.githubUsername) {
    document.getElementById('username').value = config.githubUsername;
  }
  if (config.githubRepo) {
    document.getElementById('repo').value = config.githubRepo;
  }
  
  // 保存配置
  document.getElementById('saveConfig').addEventListener('click', async () => {
    const token = document.getElementById('token').value.trim();
    const username = document.getElementById('username').value.trim();
    const repo = document.getElementById('repo').value.trim();
    
    if (!token || !username || !repo) {
      showStatus('请填写所有配置项', 'error');
      return;
    }
    
    await chrome.storage.local.set({
      githubToken: token,
      githubUsername: username,
      githubRepo: repo
    });
    
    showStatus('配置已保存！', 'success');
  });
  
  // 保存当前页面
  document.getElementById('savePage').addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractContent' });
      
      if (response && response.markdown) {
        await chrome.storage.local.set({
          currentMarkdown: response.markdown,
          currentTitle: response.title,
          currentUrl: response.url
        });
        
        chrome.tabs.create({ url: chrome.runtime.getURL('editor.html') });
        window.close();
      }
    } catch (error) {
      showStatus('无法提取页面内容，请刷新页面后重试', 'error');
    }
  });
  
  // 打开编辑器
  document.getElementById('openEditor').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('editor.html') });
    window.close();
  });
  
  // 查看草稿
  document.getElementById('viewDrafts').addEventListener('click', () => {
    chrome.tabs.create({ 
      url: chrome.runtime.getURL('editor.html') + '?view=drafts' 
    });
    window.close();
  });
  
  // 直接下载
  document.getElementById('downloadNow').addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractContent' });
      
      if (response && response.markdown) {
        const blob = new Blob([response.markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        
        const filename = sanitizeFilename(response.title) + '.md';
        
        await chrome.downloads.download({
          url: url,
          filename: filename,
          saveAs: true
        });
        
        showStatus('下载已开始！', 'success');
      }
    } catch (error) {
      showStatus('下载失败，请重试', 'error');
    }
  });
});

function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = type;
  
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}

function sanitizeFilename(title) {
  return title
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .substring(0, 100);
}
