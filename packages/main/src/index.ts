const { app, BrowserWindow } = require('electron');
const path = require('path');
const { PluginManager } = require('@core/plugin-manager');
const fs = require('fs').promises;

// Function to create the main window
const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the renderer's HTML file
  mainWindow.loadFile(path.join(__dirname, '../../renderer/dist/index.html'));

  const configPath = path.join(__dirname, 'user-config.json');
  const pluginManager = new PluginManager(configPath);
  await pluginManager.loadPlugins();
};

// Function to create the default configuration file in userData
const createDefaultConfig = async () => {
  const defaultConfigPath = path.join(__dirname, '../../config/user-config.default.json');
  const userConfigPath = path.join(app.getPath('userData'), 'user-config.json');

  try {
    // Check if user-config.json already exists
    await fs.access(userConfigPath);
    console.log('Configuration file already exists.');
  } catch {
    // If it doesn't exist, copy the default file to the userData directory
    try {
      await fs.copyFile(defaultConfigPath, userConfigPath);
      console.log('Created default configuration file in userData.');
    } catch (error) {
      console.error('Failed to create default configuration file.', error);
    }
  }
};

// Application initialization
app.on('ready', async () => {
  await createDefaultConfig(); // Ensure the configuration file exists
  await createWindow(); // Create the main window
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
