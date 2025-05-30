import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': {
        target: 'http://backend:8000', // バックエンドのURL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // '/api'を削除
      }
    }
  }
})