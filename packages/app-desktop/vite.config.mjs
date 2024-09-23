import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@renderer': path.resolve(__dirname, '../renderer/src'),
      '@commons': path.resolve(__dirname, '../commons/src'),
      '@plugin-manager': path.resolve(__dirname, '../plugin-manager/src'),
      '@events': path.resolve(__dirname, '../events/src'),
      '@config': path.resolve(__dirname, '../config/src')
    }
  },
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/main.ts'), // Ajuste o caminho se necessário
        preload: path.resolve(__dirname, 'src/preload.ts')
      }
    }
  },
  server: {
    open: false, // Desativa a abertura automática do navegador
    port: 3000, // Porta para o Vite dev server
    strictPort: true, // Se a porta não estiver disponível, não tenta outra
  }
});
