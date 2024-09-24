// /events/EventTypes.ts
export type EventCallback = (...args: any[]) => void;

export type Middleware = (event: string, ...args: any[]) => boolean | void;

export interface Event {
  type: string;
  payload?: Record<string, any>;
}

export type EventHandler = (payload?: Record<string, any>) => void;
