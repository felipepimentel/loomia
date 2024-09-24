import fs from 'fs';
import path from 'path';

interface PluginConfig {
  name: string;
  enabled: boolean;
}

interface UserConfig {
  theme: string;
  font: string;
  plugins: PluginConfig[];
}

const configPath = path.join(__dirname, 'userConfig.json');

export const loadUserConfig = (): UserConfig => {
  try {
    const configData = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configData) as UserConfig;
  } catch (error) {
    console.error("Error loading user configuration:", error);
    throw new Error("Failed to load user configuration.");
  }
};
