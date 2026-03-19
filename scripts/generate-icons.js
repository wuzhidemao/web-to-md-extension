#!/usr/bin/env node

/**
 * 图标生成脚本
 * 将SVG转换为PNG格式
 * 
 * 需要安装: npm install sharp
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sizes = [16, 48, 128];
const iconsDir = path.join(__dirname, 'icons');

// 简单的SVG生成函数（如果sharp不可用）
function generateSimpleIcon(size, outputPath) {
  // 使用canvas库或者直接创建PNG
  console.log(`生成 ${size}x${size} 图标到 ${outputPath}`);
}

async function convertSvgToPng() {
  for (const size of sizes) {
    const svgPath = path.join(iconsDir, `icon${size}.svg`);
    const pngPath = path.join(iconsDir, `icon${size}.png`);
    
    try {
      if (fs.existsSync(svgPath)) {
        const svgBuffer = fs.readFileSync(svgPath);
        
        // 尝试使用sharp转换
        try {
          const sharp = require('sharp');
          await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toFile(pngPath);
          console.log(`✓ 已生成: ${pngPath}`);
        } catch (e) {
          // 如果没有sharp，提示用户手动转换
          console.log(`需要手动转换: ${svgPath} -> ${pngPath}`);
          console.log(`可以使用在线工具如: https://svgtopng.com/`);
        }
      }
    } catch (error) {
      console.error(`处理 ${size}x${size} 图标失败:`, error.message);
    }
  }
}

// 运行
convertSvgToPng().catch(console.error);
