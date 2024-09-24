import React, { useEffect, useState } from 'react';
import { eventBus } from '@events/event-bus';
import { loadActivePlugins } from '@plugin-manager/plugin-manager';
import { PluginProvider } from '@plugin-manager/plugin-context';

const App: React.FC = () => {
  const [pluginsLoaded, setPluginsLoaded] = useState(false);

  useEffect(() => {
    const loadPlugins = async () => {
      await loadActivePlugins();
      setPluginsLoaded(true);
    };
    loadPlugins();
  }, []);

  useEffect(() => {
    const handlePluginLoaded = ({ pluginName }: { pluginName: string }) => {
      console.log(`Plugin loaded: ${pluginName}`);
    };

    const handlePluginUnloaded = ({ pluginName }: { pluginName: string }) => {
      console.log(`Plugin unloaded: ${pluginName}`);
    };

    eventBus.on('plugin-loaded', handlePluginLoaded);
    eventBus.on('plugin-unloaded', handlePluginUnloaded);

    return () => {
      eventBus.off('plugin-loaded', handlePluginLoaded);
      eventBus.off('plugin-unloaded', handlePluginUnloaded);
    };
  }, []);

  if (!pluginsLoaded) {
    return <div>Loading plugins...</div>;
  }

  return (
    <div>
      <h1>Main Application</h1>
      <PluginProvider>
        {/* Render loaded plugins here */}
      </PluginProvider>
    </div>
  );
};

export default App;
