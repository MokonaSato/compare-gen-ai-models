import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
// import { fileURLToPath } from 'url';


export default defineConfig({
  plugins: [react()],
  // resolve: {
  //   alias: {
  //     '@': resolve(__dirname, 'src'),
  //   },
  // },
  // server: {
  //   port: 3000,
  //   open: true,
  // },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'public/index.html', // 追記：エントリーポイント
    },
  },
});