// src/electron/main.js
const { app, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const settingsPath = path.join(app.getPath('userData'), 'user_settings.json');

ipcMain.handle('load-user-settings', async () => {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath);
      return JSON.parse(data);
    } else {
      return {}; // Default settings
    }
  } catch (error) {
    console.error('Error loading user settings from disk:', error);
    return {}; // Default settings
  }
});

ipcMain.handle('save-user-settings', async (event, settings) => {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error saving user settings to disk:', error);
  }
});
