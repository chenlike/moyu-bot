import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path"
import vueJsx from "@vitejs/plugin-vue-jsx"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),vueJsx()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5800",
        secure: false,
        changeOrigin: true,
      },
    },
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
})
