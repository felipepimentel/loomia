// src/core/settingsManager.ts
import { isElectron } from '@/lib/utils';

let settings: any;

async function loadSettingsWeb() {
  try {
    const response = await fetch('/user_settings.json');
    if (!response.ok) throw new Error('Failed to fetch user settings');
    return await response.json();
  } catch (error) {
    console.error('Error loading user settings (Web):', error);
    return {};
  }
}

async function loadSettingsElectron() {
  try {
    const fs = window.require('fs');
    const path = window.require('path');
    const settingsPath = path.join(__dirname, 'config', 'user_settings.json');
    const data = fs.readFileSync(settingsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading user settings (Electron):', error);
    return {};
  }
}

export async function loadUserSettings() {
  return isElectron() ? await loadSettingsElectron() : await loadSettingsWeb();
}
