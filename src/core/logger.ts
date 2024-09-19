export class Logger {
    static log(message: string, level: 'info' | 'error' | 'warning' = 'info') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }
  }
  