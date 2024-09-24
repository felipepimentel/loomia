import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

console.log('vite.main.config')
// https://vitejs.dev/config
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@plugins': path.resolve(__dirname, './src/plugins'),
      '@core': path.resolve(__dirname, './src/core'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  build: {
    outDir: '.vite/build',
    lib: {
      entry: path.resolve(__dirname, 'src/app-desktop/main.ts'),
      formats: ['cjs'],
      fileName: () => 'main.js',
    },
    rollupOptions: {
      external: ['electron', 'fs', 'path'],
      output: {
        entryFileNames: '[name].js',
      },
    },
    emptyOutDir: true,
    sourcemap: 'inline',
  },
});
