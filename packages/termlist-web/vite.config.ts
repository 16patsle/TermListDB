import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import path from 'path'
import { fileURLToPath } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  build: { target: browserslistToEsbuild() },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.join(path.dirname(fileURLToPath(import.meta.url)), 'src'),
    },
  },
})
