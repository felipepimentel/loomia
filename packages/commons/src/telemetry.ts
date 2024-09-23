import { configManager } from './config-manager';
import { logger } from './logger';

export class Telemetry {
  private enabled: boolean;

  constructor() {
    this.enabled = configManager.get('telemetry.enabled', false);
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    configManager.set('telemetry.enabled', enabled);
  }

  trackEvent(category: string, action: string, label?: string, value?: number) {
    if (!this.enabled) return;

    // Aqui você implementaria a lógica real de envio de telemetria
    // Por exemplo, enviando para um serviço como Google Analytics ou um servidor próprio
    logger.info('Telemetry', { category, action, label, value });
  }
}

export const telemetry = new Telemetry();