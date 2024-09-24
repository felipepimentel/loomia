// /events/global/GlobalEvents.ts
import { eventBus } from '../EventBus';
import { Event } from '../EventTypes';

// Definir eventos globais
const GlobalEvents = {
  USER_LOGIN: 'global:userLogin',
  USER_LOGOUT: 'global:userLogout',
  SETTINGS_CHANGED: 'global:settingsChanged'
} as const;

// Ouvinte de evento de login
eventBus.on(GlobalEvents.USER_LOGIN, (payload) => {
  console.log('User logged in:', payload);
});

// Emissor de evento de login
export const emitUserLogin = (userId: number) => {
  const event: Event = { type: GlobalEvents.USER_LOGIN, payload: { userId } };
  eventBus.emit(event.type, event.payload);
};

export default GlobalEvents;
