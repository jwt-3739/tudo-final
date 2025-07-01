import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()], // 自动引入 Element Plus
    }),
    Components({
      resolvers: [ElementPlusResolver()], // 自动引入 Element Plus 组件
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 确保路径别名指向 src 目录
    },
  },
})
