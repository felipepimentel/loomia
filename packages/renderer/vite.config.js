import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@renderer': path.resolve(__dirname, 'src'),
      '@commons': path.resolve(__dirname, '../commons/src'),
      '@ui': path.resolve(__dirname, '../ui/src'),
      '@state': path.resolve(__dirname, '../state/src'),
      '@events': path.resolve(__dirname, '../events/src'),
      '@config': path.resolve(__dirname, '../config/src'),
      '@plugin-manager': path.resolve(__dirname, '../plugin-manager/src'),
      '@core-plugins': path.resolve(__dirname, '../core-plugins/src'),
      '@community-plugins': path.resolve(__dirname, '../community-plugins/src')
    }
  },
  plugins: [react()],
  server: {
    port: 3000
  }
});
