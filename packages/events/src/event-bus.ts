import mitt from 'mitt';

type Events = {
  'plugin-loaded': { pluginName: string };
  'plugin-unloaded': { pluginName: string };
  [key: string]: any; // Support for custom events
};

export const eventBus = mitt<Events>();
