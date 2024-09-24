// /events/middleware/validationMiddleware.ts
import { Middleware } from '../EventTypes';

export const validationMiddleware: Middleware = (event, ...args) => {
  if (event === 'USER_LOGIN' && typeof args[0]?.userId !== 'number') {
    console.warn(`Invalid userId: ${args[0]?.userId}`);
    return false; // Bloqueia a emissão do evento
  }
  return true;
};
