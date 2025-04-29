# 图片压缩工具

基于 Vite + React + TypeScript + WebAssembly 的图片压缩工具，支持常见图片格式的压缩，并提供一键打包下载功能。

## 功能特性

- 使用 WebAssembly 技术进行高效图像压缩
- 支持 JPG, PNG, WEBP, GIF, BMP, TIFF 等多种图像格式
- 可自定义压缩质量
- 批量上传和处理图像
- 一键打包下载所有压缩后的图像
- 保持原始文件名
- 可视化展示压缩前后的大小对比
- 支持拖拽文件上传

## 技术栈

- **前端框架**：React (^19.x) + TypeScript (^5.x)
- **构建工具**：Vite (^6.x)
- **UI组件库**：Ant Design (^5.x)
- **图像压缩**：browser-image-compression (^2.x)
- **文件打包及下载**：JSZip (^3.x), FileSaver (^2.x)
- **样式处理**：Sass (^1.x)

## 开发环境

### 依赖安装

```bash
pnpm install
```

### 开发服务器

```bash
pnpm run dev
```

### 构建生产版本

```bash
pnpm run build
```

### 预览生产版本

```bash
pnpm run preview
```

## 项目脚本

项目根目录提供了一些脚本命令，使用 npm 或 pnpm 执行：

- **dev**: 启动开发服务器（`npm run dev` 或 `pnpm run dev`）
- **build**: 构建生产版本（`npm run build`）
- **preview**: 预览构建后的应用（`npm run preview`）
- **lint**: 运行 ESLint 检查并自动修复（`npm run lint`）
- **lint:fix**: 运行 ESLint 并修复问题（`npm run lint:fix`）
- **format**: 使用 Prettier 格式化代码（`npm run format`）
- **format:check**: 检查代码格式（`npm run format:check`）

## 浏览器兼容性

本应用使用 WebAssembly 技术，需要现代浏览器支持：

- Chrome 57+
- Firefox 52+
- Safari 11+
- Edge 16+

## 使用说明

1. 打开应用后，点击上传区域或将图片拖拽到上传区域
2. 调整压缩质量（默认 80%）
3. 点击"压缩图片"按钮开始压缩
4. 压缩完成后，可以单独下载每张图片，或点击"打包下载"按钮将所有压缩后的图片打包下载

## 许可证

MIT
