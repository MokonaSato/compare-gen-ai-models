// Viteの環境変数型定義を追加
/// <reference types="vite/client" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true, // 指定したポートが使用できなければエラーを出す
    proxy: {
      "/notebooks": {
        target: "http://wordbook-backend:8000",
        changeOrigin: true,
        secure: false,
      },
      "/cards": {
        target: "http://wordbook-backend:8000",
        changeOrigin: true,
        secure: false,
      },
      "/tags": {
        target: "http://wordbook-backend:8000",
        changeOrigin: true,
        secure: false,
      }
    } 
  },
  preview: {
    port: 3000,
    host: "0.0.0.0",
    proxy: {
      "/notebooks": {
        target: "http://wordbook-backend:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
      "/cards": {
        target: "http://wordbook-backend:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
      "/tags": {
        target: "http://wordbook-backend:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      }
    } 
  }
});