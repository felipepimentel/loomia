export class EventManager {
    private listeners: { [event: string]: Function[] } = {};
  
    emit(event: string, data: any) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(listener => listener(data));
      }
    }
  
    on(event: string, listener: Function) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(listener);
    }
  }
  