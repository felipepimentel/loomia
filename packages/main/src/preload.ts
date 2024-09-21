import { contextBridge, ipcRenderer } from 'electron';
import { IpcRendererHandler } from '@core/types';

const api: IpcRendererHandler = {
  sendPluginAction: (pluginId: string, action: string) => {
    ipcRenderer.send('plugin-action', pluginId, action);
  }
};

contextBridge.exposeInMainWorld('api', api);