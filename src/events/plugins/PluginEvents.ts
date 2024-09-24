// /events/plugins/PluginEvents.ts
import { eventBus } from '../EventBus';
import { Event } from '../EventTypes';

// Definir eventos de plugins
const PluginEvents = {
  PLUGIN_REGISTERED: 'plugin:pluginRegistered',
  PLUGIN_UNREGISTERED: 'plugin:pluginUnregistered',
  PLUGIN_UPDATED: 'plugin:pluginUpdated'
} as const;

// Ouvinte de evento de registro de plugin
eventBus.on(PluginEvents.PLUGIN_REGISTERED, (payload) => {
  console.log('Plugin registered:', payload);
});

// Emissor de evento de registro de plugin
export const emitPluginRegistered = (pluginName: string) => {
  const event: Event = { type: PluginEvents.PLUGIN_REGISTERED, payload: { pluginName } };
  eventBus.emit(event.type, event.payload);
};

export default PluginEvents;
