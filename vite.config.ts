import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@main': path.resolve(__dirname, './src/main'),
      '@renderer': path.resolve(__dirname, './src/renderer'),
      '@core': path.resolve(__dirname, './src/core'),
      '@plugins': path.resolve(__dirname, './src/plugins'),
    },
  },
  build: {
    outDir: 'dist',
    target: 'esnext',  // Define o target para o ambiente mais moderno
  },
  optimizeDeps: {
    esbuildOptions: {
      // Permite que o Vite processe arquivos TypeScript corretamente
      plugins: [
        {
          name: 'load-ts-files',
          setup(build) {
            build.onLoad({ filter: /src\/.*\.ts$/ }, async (args) => ({
              loader: 'ts',
            }));
          },
        },
      ],
    },
  },
});
