// /events/middleware/loggingMiddleware.ts
import { Middleware } from '../EventTypes';

export const loggingMiddleware: Middleware = (event, ...args) => {
  console.log(`Event: ${event}`, ...args);
  return true; // Permite a emissão do evento
};
