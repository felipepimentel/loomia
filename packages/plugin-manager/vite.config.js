import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@plugin-manager': path.resolve(__dirname, 'src'),
      '@commons': path.resolve(__dirname, '../commons/src')
    }
  }
});
