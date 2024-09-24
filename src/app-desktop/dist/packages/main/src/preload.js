"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const api = {
    sendPluginAction: (pluginId, action) => {
        electron_1.ipcRenderer.send('plugin-action', pluginId, action);
    }
};
electron_1.contextBridge.exposeInMainWorld('api', api);
