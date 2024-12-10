import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       // Option 1: Add global variables/mixins
  //       additionalData: `
  //         @import "./src/styles/variables.scss";
  //         @import "./src/styles/mixins.scss";
  //       `,
  //     },
  //   },
  // },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
