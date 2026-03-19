# 网页转Markdown - Edge浏览器扩展

## 功能介绍

这是一个Edge浏览器扩展，可以：
- 📝 将网页内容一键转换为Markdown格式
- ✏️ 内置Markdown编辑器，支持实时预览
- 💾 保存草稿到本地
- ⬇️ 直接下载Markdown文件
- 🚀 一键发布到GitHub仓库

## 安装步骤
### **首先下载web-to-md-extension.zip，[点击下载](https://github.com/wuzhidemao/web-to-md-extension/releases/tag/%E5%8F%91%E8%A1%8C)**
### 方法一：开发者模式加载（推荐）

1. **打开Edge扩展管理页面**
   - 在地址栏输入：`edge://extensions/`
   - 或点击菜单 → 扩展 → 管理扩展

2. **开启开发者模式**
   - 在左下角找到"开发人员模式"开关，打开它

3. **加载扩展**
   - 点击"加载解压缩的扩展"按钮
   - 选择 `web-to-md-extension` 文件夹
   - 扩展将自动加载并显示在工具栏

4. **固定到工具栏**（可选）
   - 点击扩展图标旁边的拼图图标
   - 找到"网页转Markdown"，点击图钉图标固定

### 方法二：打包安装

1. 在扩展管理页面点击"打包扩展"
2. 选择扩展文件夹路径
3. 生成 `.crx` 文件和私钥
4. 将 `.crx` 文件拖放到扩展管理页面安装

## 使用方法

### 1. 保存网页为Markdown

**方式一：右键菜单**
- 在任意网页上右键
- 选择"保存为Markdown"
- 自动打开编辑器

**方式二：扩展图标**
- 点击工具栏上的扩展图标
- 点击"保存当前页面"
- 自动打开编辑器

**方式三：选中内容**
- 选中网页上的文字
- 右键选择"保存为Markdown"
- 只保存选中内容

### 2. 编辑Markdown

- 左侧面板：编辑Markdown源码
- 右侧面板：实时预览效果
- 工具栏：快速插入格式（粗体、链接、图片等）

### 3. 保存草稿

- 点击"保存草稿"按钮
- 草稿自动保存在本地存储
- 可以通过"查看草稿"访问历史草稿

### 4. 下载文件

- 点击"下载"按钮
- 直接下载 `.md` 文件到本地

### 5. 发布到GitHub

#### 配置GitHub信息

1. 点击扩展图标
2. 填写以下信息：
   - **访问令牌(Token)**：GitHub Personal Access Token
   - **用户名**：你的GitHub用户名
   - **仓库名**：目标仓库名称
3. 点击"保存配置"

#### 获取GitHub Token

1. 访问 https://github.com/settings/tokens
2. 点击"Generate new token (classic)"
3. 选择有效期和权限（勾选 `repo` 权限）
4. 生成并复制Token（只显示一次！）

#### 发布文件

1. 在编辑器中完成内容
2. 点击"发布到GitHub"
3. 设置文件路径（如：`notes/article.md`）
4. 填写提交信息
5. 点击"确认发布"

## 文件结构

```
web-to-md-extension/
├── manifest.json      # 扩展配置
├── background.js      # 后台脚本
├── content.js         # 内容脚本（提取网页）
├── popup.html         # 弹出窗口
├── popup.js           # 弹出窗口逻辑
├── editor.html        # Markdown编辑器
├── editor.js          # 编辑器逻辑
├── styles/
│   ├── popup.css      # 弹出窗口样式
│   └── editor.css     # 编辑器样式
└── icons/
    ├── icon16.svg     # 16x16图标
    ├── icon48.svg     # 48x48图标
    └── icon128.svg    # 128x128图标
```

## 技术说明

- **Manifest V3**：使用最新的Chrome扩展标准
- **纯前端实现**：无需后端服务器
- **本地存储**：草稿和配置保存在浏览器本地
- **GitHub API**：使用REST API v3进行文件操作

## 注意事项

1. **GitHub Token安全**：Token保存在浏览器本地存储，请勿分享给他人
2. **文件覆盖**：如果GitHub上已存在同名文件，会被覆盖
3. **网络要求**：发布到GitHub需要网络连接
4. **权限**：首次使用可能需要授权访问当前页面

## 常见问题

**Q: 为什么有些网页无法提取内容？**
A: 某些网站使用动态加载或反爬虫技术，可能无法正确提取。

**Q: 发布到GitHub失败？**
A: 请检查：
- Token是否正确且有 `repo` 权限
- 仓库名是否正确
- 网络连接是否正常

**Q: 如何更新扩展？**
A: 修改代码后，在扩展管理页面点击"重新加载"按钮。

## 许可证

MIT License
