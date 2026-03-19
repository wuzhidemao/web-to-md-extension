# 📝 网页转Markdown - Edge浏览器扩展

将任意网页一键转换为Markdown格式，编辑后直接发布到GitHub仓库。

![版本](https://img.shields.io/badge/version-1.0.0-blue)
![许可证](https://img.shields.io/badge/license-MIT-green)

## ✨ 功能特点

- 🔄 **一键转换** - 右键菜单或扩展图标，快速将网页转为Markdown
- ✏️ **内置编辑器** - 实时预览的Markdown编辑器，支持语法高亮
- 💾 **草稿管理** - 本地保存草稿，随时继续编辑
- ⬇️ **本地下载** - 直接下载 `.md` 文件
- 🚀 **GitHub集成** - 一键发布到GitHub仓库
- 🎯 **智能提取** - 自动识别正文内容，去除广告和导航

## 📦 安装
### **首先下载web-to-md-extension.zip，[点击下载](https://github.com/wuzhidemao/web-to-md-extension/releases/tag/%E5%8F%91%E8%A1%8C)**
### 开发者模式加载

1. 打开 Edge 浏览器，访问 `edge://extensions/`
2. 开启左下角的"开发人员模式"
3. 点击"加载解压缩的扩展"
4. 选择 `web-to-md-extension` 文件夹
5. 完成！扩展图标将出现在工具栏

详细安装说明见 [INSTALL.md](INSTALL.md)

## 🚀 使用方法

### 保存网页

**右键菜单方式：**
1. 在任意网页右键
2. 选择"保存为Markdown"
3. 自动打开编辑器

**扩展图标方式：**
1. 点击工具栏扩展图标
2. 点击"保存当前页面"

**选中内容方式：**
1. 选中网页上的文字
2. 右键选择"保存为Markdown"
3. 只保存选中内容

### 编辑Markdown

- 左侧编辑，右侧实时预览
- 工具栏快速插入格式
- 支持标准Markdown语法

### 发布到GitHub

1. 在扩展弹出窗口配置GitHub信息
2. 在编辑器中点击"发布到GitHub"
3. 设置文件路径和提交信息
4. 一键发布！

配置详情见 [INSTALL.md](INSTALL.md)

## 📁 项目结构

```
web-to-md-extension/
├── manifest.json          # 扩展配置
├── background.js          # 后台服务脚本
├── content.js             # 网页内容提取
├── popup.html/js          # 扩展弹出窗口
├── editor.html/js/css     # Markdown编辑器
├── styles/                # 样式文件
├── icons/                 # 图标文件
├── scripts/               # 工具脚本
└── INSTALL.md             # 详细安装指南
```

## 🔧 技术栈

- **Manifest V3** - Chrome/Edge扩展标准
- **Vanilla JS** - 纯JavaScript实现
- **CSS3** - 现代化样式
- **GitHub REST API** - 文件发布

## 📝 更新日志

### v1.0.0 (2026-03-18)
- ✨ 初始版本发布
- 🔄 网页转Markdown功能
- ✏️ 内置Markdown编辑器
- 💾 草稿管理
- 🚀 GitHub发布集成

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 感谢使用本扩展！
- 如有问题或建议，请在GitHub上提交Issue

---

Made with ❤️ by [眠](https://github.com/wuzhidemao)
