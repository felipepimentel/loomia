import { defineConfig } from '@electron-forge/plugin-vite';

export default {
  packagerConfig: {
    icon: './src/assets/icon',
    // Adicione outras configurações de empacotamento aqui
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    [
      defineConfig({
        build: [
          {
            entry: 'packages/app-desktop/src/main.ts',
            config: 'packages/app-desktop/vite.config.mts',
          },
        ],
        renderer: [
          {
            entry: 'packages/renderer/src/index.tsx',
            config: 'packages/renderer/vite.config.mts',
          },
        ],
      }),
    ],
  ],
};
