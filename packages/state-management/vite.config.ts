import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import { resolve } from 'path'

// export default defineConfig({
//   plugins: [vue()],
//   resolve: {
//     alias: {
//       '@': resolve(__dirname, 'src')
//     }
//   },
//   server: {
//     port: 3003
//   }
// })
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
