type EventHandler = (...args: any[]) => Promise<void> | void;

export class EventBus {
  private events: Map<string, EventHandler[]> = new Map();

  on(eventName: string, handler: EventHandler) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName)!.push(handler);
  }

  off(eventName: string, handler: EventHandler) {
    const handlers = this.events.get(eventName);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  async emit(eventName: string, ...args: any[]) {
    const handlers = this.events.get(eventName) || [];
    await Promise.all(handlers.map(handler => handler(...args)));
  }
}

export const globalEventBus = new EventBus();