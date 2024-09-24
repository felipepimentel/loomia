import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

interface PluginConfig {
  active: boolean;
  source: string;
  pluginSettings?: Record<string, unknown>;
}

interface Plugin {
  [key: string]: PluginConfig;
}

const loadPlugins = async () => {
  const configPath = path.join(__dirname, '../../assets/user-config.default.json');
  try {
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as { plugins: Plugin[] };
    const activePlugins = configData.plugins.filter(plugin =>
      Object.values(plugin)[0].active
    );

    for (const plugin of activePlugins) {
      const pluginName = Object.keys(plugin)[0];
      const pluginConfig = plugin[pluginName];

      if (pluginConfig.source === 'core') {
        try {
          const pluginModule = await import(`../../src/plugins/${pluginName}/index.ts`);
          if (typeof pluginModule.default === 'function') {
            pluginModule.default(pluginConfig.pluginSettings);
          } else {
            console.warn(`Plugin ${pluginName} does not export a default function.`);
          }
        } catch (error) {
          console.error(`Error loading plugin ${pluginName}:`, error);
        }
      } else {
        console.warn(`Plugin ${pluginName} is not a core plugin and will be ignored.`);
      }
    }
  } catch (error) {
    console.error('Error loading plugin configuration:', error);
  }
};

const createWindow = async () => {
  // Load plugins before creating the window
  await loadPlugins();

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
    },
  });

  // and load the index.html of the app.
  if (process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${process.env.MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
