import React from 'react';
import { useState, useEffect } from 'react';
import { loadUserSettings, saveUserSettings } from '@core/user-config';
import { Plugin } from '@/types';
import { Button } from '@/components/ui/button';

const PluginMarketplace = () => {
  const [availablePlugins, setAvailablePlugins] = useState<Plugin[]>([]);
  const [userSettings, setUserSettings] = useState<any>({});

  useEffect(() => {
    const fetchPlugins = async () => {
      const settings = await loadUserSettings();
      setUserSettings(settings);
      // Fetch available plugins from a source (static or remote)
      // setAvailablePlugins(fetchedPlugins);
    };

    fetchPlugins();
  }, []);

  const togglePlugin = async (pluginName: string, isActive: boolean) => {
    const updatedSettings = { ...userSettings };
    const pluginIndex = updatedSettings.plugins.findIndex(
      (plugin: any) => Object.keys(plugin)[0] === pluginName
    );

    if (pluginIndex > -1) {
      updatedSettings.plugins[pluginIndex][pluginName].active = isActive ? 'true' : 'false';
    } else {
      updatedSettings.plugins.push({ [pluginName]: { active: isActive ? 'true' : 'false' } });
    }

    setUserSettings(updatedSettings);
    await saveUserSettings(updatedSettings);
  };

  return (
    <div className="p-4">
      <h2>Plugin Marketplace</h2>
      <div className="grid gap-4">
        {availablePlugins.map((plugin) => (
          <div key={plugin.name} className="flex items-center justify-between p-2 border">
            <span>{plugin.name}</span>
            <Button onClick={() => togglePlugin(plugin.name, !plugin.active)}>
              {plugin.active ? 'Disable' : 'Enable'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PluginMarketplace;
