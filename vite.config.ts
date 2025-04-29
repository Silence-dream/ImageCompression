import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
import { vitePluginReactSource } from 'react-find/vite';
export default defineConfig({
  plugins: [react(), vitePluginReactSource()],
  base: '/ImageCompression/',
  // 优化WebAssembly加载
  server: {
    headers: {
      // 确保WebAssembly跨域策略正确
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },

  // 优化资源处理
  build: {
    target: 'es2015', // 确保更好的浏览器兼容性
    assetsInlineLimit: 0, // 禁止内联wasm文件
  },

  // 配置解析
  resolve: {
    alias: {
      '@': '/src', // 便于导入
    },
  },
});
