import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    federation({
      name: 'mfeBoard',
      filename: 'remoteEntry.js',
      exposes: {
        './BoardPage': './src/pages/BoardPage.tsx',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.2.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.2.0',
        },
      },
    }),
  ],
  server: {
    port: 3001,
  },
  build: {
    target: 'esnext',
    manifest: true,
    outDir: 'dist',
  },
});
