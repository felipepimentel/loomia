import i18next from 'i18next';
import { configManager } from './config-manager';

export class I18nAPI {
  private i18n: typeof i18next;

  constructor() {
    this.i18n = i18next.createInstance();
    this.init();
  }

  private async init() {
    const language = configManager.get('language', 'en');
    await this.i18n.init({
      lng: language,
      fallbackLng: 'en',
      resources: {
        en: {
          translation: require('../locales/en.json')
        },
        // Adicione outros idiomas aqui
      }
    });
  }

  translate(key: string, options?: any): string {
    return this.i18n.t(key, options);
  }

  changeLanguage(language: string) {
    this.i18n.changeLanguage(language);
    configManager.set('language', language);
  }

  addResourceBundle(language: string, namespace: string, resources: object) {
    this.i18n.addResourceBundle(language, namespace, resources);
  }
}

export const i18nAPI = new I18nAPI();