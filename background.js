// 后台脚本 - 处理右键菜单和消息通信

// 初始化右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'saveAsMarkdown',
    title: '保存为Markdown',
    contexts: ['page', 'selection']
  });
  
  chrome.contextMenus.create({
    id: 'openEditor',
    title: '打开Markdown编辑器',
    contexts: ['action']
  });
});

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saveAsMarkdown') {
    // 发送消息给content script提取内容
    chrome.tabs.sendMessage(tab.id, { action: 'extractContent' }, (response) => {
      if (response && response.markdown) {
        // 保存到存储并打开编辑器
        chrome.storage.local.set({ 
          currentMarkdown: response.markdown,
          currentTitle: response.title,
          currentUrl: response.url
        }, () => {
          chrome.tabs.create({ url: chrome.runtime.getURL('editor.html') });
        });
      }
    });
  }
});

// 处理来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openEditor') {
    chrome.storage.local.set({
      currentMarkdown: request.markdown,
      currentTitle: request.title,
      currentUrl: request.url
    }, () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('editor.html') });
    });
  }
  return true;
});
