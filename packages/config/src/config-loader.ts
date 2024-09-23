import { UserConfig } from '@commons/plugin-registry/types';
import path from 'path';
import fs from 'fs';

const configPath = path.join(__dirname, '../../../../main/src/userConfig.json');

export const loadUserConfig = (): UserConfig => {
  try {
    const configData = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configData) as UserConfig;
  } catch (error) {
    console.error('Error loading user configuration:', error);
    throw new Error('Failed to load user configuration.');
  }
};
