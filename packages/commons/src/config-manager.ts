import * as fs from 'fs/promises';
import * as path from 'path';
import { app } from 'electron';

export class ConfigManager {
  private config: Record<string, any> = {};
  private configPath: string;

  constructor() {
    this.configPath = path.join(app.getPath('userData'), 'config.json');
  }

  async load() {
    try {
      const data = await fs.readFile(this.configPath, 'utf-8');
      this.config = JSON.parse(data);
    } catch (error) {
      console.error('Failed to load config:', error);
      this.config = {};
    }
  }

  async save() {
    try {
      await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  get(key: string, defaultValue?: any) {
    return key in this.config ? this.config[key] : defaultValue;
  }

  set(key: string, value: any) {
    this.config[key] = value;
    this.save();
  }
}

export const configManager = new ConfigManager();