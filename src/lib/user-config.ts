import { logError } from './utils';

export async function loadUserSettings() {
  try {
    // Em uma aplicação real, isso carregaria de um arquivo ou API
    return {
      plugins: [
        {
          "header-plugin": {
            active: true,
            source: 'core'
          }
        },
        {
          "left-toolbar-plugin": {
            active: true,
            source: 'core'
          }
        },
        {
          "right-sidebar-plugin": {
            active: true,
            source: 'core'
          }
        },
        {
          "bottom-toolbar-plugin": {
            active: true,
            source: 'core'
          }
        },
        {
          "canvas-plugin": {
            active: true,
            source: 'core'
          }
        }
      ]
    };
  } catch (error) {
    logError('Failed to load user settings:', error);
    return { plugins: [] };
  }
}