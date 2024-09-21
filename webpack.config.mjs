import path from 'path';
import { fileURLToPath } from 'url';
import nodeExternals from 'webpack-node-externals';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom plugin to load only active plugins
class ActivePluginsLoader {
  apply(compiler) {
    compiler.hooks.beforeCompile.tapAsync('ActivePluginsLoader', (params, callback) => {
      const configPath = path.resolve(__dirname, 'config/user-config.default.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      const activePlugins = config.plugins.filter(plugin => Object.values(plugin)[0].active).map(plugin => Object.keys(plugin)[0]);
      
      compiler.options.entry = {
        ...compiler.options.entry,
        ...Object.fromEntries(activePlugins.map(plugin => [
          `plugins/${plugin}`,
          `./packages/plugins/${plugin}/index.ts`
        ]))
      };
      
      callback();
    });
  }
}

const commonConfig = {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'], // Adicionado .css aqui
    alias: {
      '@': path.resolve(__dirname, './packages'),
      '@core': path.resolve(__dirname, './packages/core/src'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom')
    },
    modules: [
      'node_modules',
      path.resolve(__dirname, 'packages')
    ]
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: /packages/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              jsx: 'react-jsx'
            }
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'config/user-config.default.json', to: 'user-config.json' }
      ],
    }),
    new ActivePluginsLoader()
  ]
};

const mainConfig = {
  ...commonConfig,
  entry: './packages/main/src/index.ts',
  target: 'electron-main',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [
          path.resolve(__dirname, 'packages/main'),
          path.resolve(__dirname, 'packages/core') // Adicione esta linha
        ],
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              module: 'CommonJS'
            }
          }
        }
      }
    ]
  },
  resolve: {
    ...commonConfig.resolve,
    alias: {
      ...commonConfig.resolve.alias,
      '@core': path.resolve(__dirname, 'packages/core/src')
    }
  }
};

export default [
  mainConfig,
  // Renderer process
  {
    ...commonConfig,
    entry: './packages/renderer/src/index.tsx',
    target: 'electron-renderer',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'renderer.js'
    }
  },
  // Preload script
  {
    ...commonConfig,
    entry: './packages/main/src/preload.ts',
    target: 'electron-preload',
    output: {
      path: path.resolve(__dirname, 'packages/main/dist'),
      filename: 'preload.js'
    }
  }
];