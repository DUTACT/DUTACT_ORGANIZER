import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr'
// @ts-ignore
import history from 'vite-plugin-history-api-fallback'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), history()],
  server: {
    port: 6969
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      input: '/index.html'
    }
  }
})
