// /events/EventBus.ts
import { Middleware, EventCallback } from './EventTypes';

type EventEntry = {
  callback: EventCallback;
  priority: number;
};

class EventBus {
  private events: Record<string, EventEntry[]> = {};
  private middlewares: Middleware[] = [];

  // Registrar um novo ouvinte de evento
  on(event: string, callback: EventCallback, priority: number = 0): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push({ callback, priority });
    this.events[event].sort((a, b) => b.priority - a.priority);
  }

  // Remover um ouvinte de evento
  off(event: string, callback: EventCallback): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(entry => entry.callback !== callback);
  }

  // Adicionar middleware ao EventBus
  use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  // Emitir um evento, aplicando middlewares e chamando os ouvintes
  emit(event: string, ...args: any[]): void {
    let isAllowed = true;

    // Aplicar middlewares antes de emitir o evento
    for (const middleware of this.middlewares) {
      const result = middleware(event, ...args);
      if (result === false) {
        isAllowed = false;
        break;
      }
    }

    if (isAllowed && this.events[event]) {
      for (const { callback } of this.events[event]) {
        callback(...args);
      }
    }
  }

  // Limpar todos os ouvintes de um evento
  clear(event: string): void {
    if (!this.events[event]) return;
    this.events[event] = [];
  }
}

export const eventBus = new EventBus();
