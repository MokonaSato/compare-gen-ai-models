import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
  },
  // resolve: {
  //   alias: {
  //     '@': '/src',
  //   },
  // },
});