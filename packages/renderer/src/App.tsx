import React, { useState, useEffect } from 'react';
import { pluginManager } from '@core/plugin-manager';

const App: React.FC = () => {
  const [tool, setTool] = useState<string>('select');
  const [documentTitle, setDocumentTitle] = useState<string>('Untitled');
  const [plugins, setPlugins] = useState<any>({});

  useEffect(() => {
    const loadPlugins = async () => {
      await pluginManager.initializePlugins();
      const loadedPlugins = {
        Header: pluginManager.getPlugin('headerPlugin'),
        LeftToolbar: pluginManager.getPlugin('leftToolbarPlugin'),
        BottomToolbar: pluginManager.getPlugin('bottomToolbarPlugin'),
        MainCanvas: pluginManager.getPlugin('canvasPlugin'),
        RightSidebar: pluginManager.getPlugin('rightSidebarPlugin'),
      };
      setPlugins(loadedPlugins);
    };

    loadPlugins();
  }, []);

  if (
    !plugins.Header ||
    !plugins.LeftToolbar ||
    !plugins.BottomToolbar ||
    !plugins.MainCanvas ||
    !plugins.RightSidebar
  ) {
    return <div>Loading plugins...</div>;
  }

  const { Header, LeftToolbar, BottomToolbar, MainCanvas, RightSidebar } = plugins;

  return (
    <div className="app flex flex-col h-screen overflow-hidden">
      <Header.component documentTitle={documentTitle} onTitleChange={setDocumentTitle} />

      <div className="flex flex-1 overflow-hidden">
        <LeftToolbar.component tool={tool} setTool={setTool} />
        <MainCanvas.component tool={tool} />
        <RightSidebar.component />
      </div>

      <BottomToolbar.component />
    </div>
  );
};

export default App;
