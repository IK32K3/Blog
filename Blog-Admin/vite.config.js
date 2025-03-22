// vite.config.js - modified for GitHub Pages deployment
import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';
import { resolve } from 'path';

// Set the base path for GitHub Pages
// This should match your repository name: /Blog/
const basePath = '/Blog/';

export default defineConfig({
  plugins: [injectHTML()],
  base: basePath, // This is crucial for GitHub Pages
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: '/src/pages/dashboard.html'
  },
  build: {
    outDir: 'dist', // Output to dist folder
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/pages/dashboard.html'),
        userList: resolve(__dirname, 'src/pages/users/index.html'),
        postList: resolve(__dirname, 'src/pages/posts/index.html'),
        categoryList: resolve(__dirname, 'src/pages/categories/index.html'),
        commentList: resolve(__dirname, 'src/pages/comments/index.html'),
        languageList: resolve(__dirname, 'src/pages/languages/index.html'),
        settings: resolve(__dirname, 'src/pages/settings/index.html'),
      }
    }
  }
});