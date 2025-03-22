import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';
import { resolve } from 'path';

export default defineConfig({
  plugins: [injectHTML()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'src/pages/dashboard.html'),
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
