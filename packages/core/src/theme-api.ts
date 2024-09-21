import { EventEmitter } from 'events';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

class ThemeAPI extends EventEmitter {
  private currentTheme: 'light' | 'dark' = 'light';
  private themes: Record<string, ThemeColors> = {
    light: {
      primary: '#007bff',
      secondary: '#6c757d',
      background: '#ffffff',
      text: '#000000'
    },
    dark: {
      primary: '#0056b3',
      secondary: '#495057',
      background: '#121212',
      text: '#ffffff'
    }
  };

  constructor() {
    super();
    // Carregar tema inicial do configManager
  }

  getCurrentTheme(): ThemeColors {
    return this.themes[this.currentTheme];
  }

  setTheme(theme: 'light' | 'dark') {
    this.currentTheme = theme;
    this.emit('themeChanged', this.getCurrentTheme());
  }

  registerCustomTheme(name: string, colors: ThemeColors) {
    this.themes[name] = colors;
  }
}

export const themeAPI = new ThemeAPI();