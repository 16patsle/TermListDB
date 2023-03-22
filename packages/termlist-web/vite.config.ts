import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import path from 'path'
import { fileURLToPath } from 'url'
import { webpackStats } from 'rollup-plugin-webpack-stats';

// https://vitejs.dev/config/
export default defineConfig({
  build: { target: browserslistToEsbuild() },
  plugins: [
    vue(),
    // Output webpack-stats.json file
    webpackStats(),
  ],
  resolve: {
    alias: {
      '@': path.join(path.dirname(fileURLToPath(import.meta.url)), 'src'),
    },
  },
})
