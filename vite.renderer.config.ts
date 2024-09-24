import { defineConfig } from 'vite';
import path from 'path';

console.log('vite.renderer.config')
// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      '@state': path.resolve(__dirname, 'src/state'),
      '@events': path.resolve(__dirname, 'src/events'),
    },
  },
});
