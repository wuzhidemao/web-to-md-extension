// 内容脚本 - 提取网页内容并转换为Markdown

// Turndown配置 - 简化版（实际使用时需要引入完整库）
function htmlToMarkdown(html, title, url) {
  // 创建临时DOM解析
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // 移除不需要的元素
  const removeSelectors = [
    'script', 'style', 'nav', 'header', 'footer', 
    'aside', '.advertisement', '.ads', '.sidebar',
    '.comments', '.social-share', 'iframe'
  ];
  
  removeSelectors.forEach(selector => {
    doc.querySelectorAll(selector).forEach(el => el.remove());
  });
  
  // 尝试找到主要内容区域
  let content = doc.querySelector('article') || 
                doc.querySelector('main') || 
                doc.querySelector('.content') ||
                doc.querySelector('#content') ||
                doc.querySelector('.post') ||
                doc.body;
  
  // 简单的HTML到Markdown转换
  let markdown = convertToMarkdown(content);
  
  // 添加元信息
  const frontmatter = `---
title: ${title}
url: ${url}
date: ${new Date().toISOString()}
---

`;
  
  return frontmatter + markdown;
}

function convertToMarkdown(element) {
  let md = '';
  
  function traverse(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent.trim();
    }
    
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }
    
    const tag = node.tagName.toLowerCase();
    let content = '';
    
    node.childNodes.forEach(child => {
      content += traverse(child);
    });
    
    switch (tag) {
      case 'h1': return `# ${content}\n\n`;
      case 'h2': return `## ${content}\n\n`;
      case 'h3': return `### ${content}\n\n`;
      case 'h4': return `#### ${content}\n\n`;
      case 'h5': return `##### ${content}\n\n`;
      case 'h6': return `###### ${content}\n\n`;
      case 'p': return content ? `${content}\n\n` : '';
      case 'br': return '\n';
      case 'hr': return '---\n\n';
      case 'strong':
      case 'b': return content ? `**${content}**` : '';
      case 'em':
      case 'i': return content ? `*${content}*` : '';
      case 'code': return content ? `\`${content}\`` : '';
      case 'pre': return content ? `\`\`\`\n${content}\n\`\`\`\n\n` : '';
      case 'a': 
        const href = node.getAttribute('href');
        return href ? `[${content}](${href})` : content;
      case 'img':
        const src = node.getAttribute('src');
        const alt = node.getAttribute('alt') || '';
        return src ? `![${alt}](${src})\n\n` : '';
      case 'ul':
        return content.split('\n').filter(l => l.trim()).map(l => `* ${l}`).join('\n') + '\n\n';
      case 'ol':
        return content.split('\n').filter(l => l.trim()).map((l, i) => `${i + 1}. ${l}`).join('\n') + '\n\n';
      case 'li': return content ? `${content}\n` : '';
      case 'blockquote': return content ? `> ${content.replace(/\n/g, '\n> ')}\n\n` : '';
      default: return content;
    }
  }
  
  return traverse(element).trim();
}

// 监听来自background的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    const selection = window.getSelection().toString();
    
    // 如果有选中的文本，优先使用选中的内容
    let htmlToConvert;
    if (selection && selection.length > 0) {
      const range = window.getSelection().getRangeAt(0);
      const div = document.createElement('div');
      div.appendChild(range.cloneContents());
      htmlToConvert = div.innerHTML;
    } else {
      // 否则提取整个页面内容
      const article = document.querySelector('article') || 
                     document.querySelector('main') || 
                     document.querySelector('.content') ||
                     document.body;
      htmlToConvert = article.innerHTML;
    }
    
    const markdown = htmlToMarkdown(htmlToConvert, document.title, window.location.href);
    
    sendResponse({
      markdown: markdown,
      title: document.title,
      url: window.location.href
    });
  }
  return true;
});
