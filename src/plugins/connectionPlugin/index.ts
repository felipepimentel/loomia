// plugins/connectionPlugin/index.ts
import { ConnectionManager } from './connectionManager';
import { Plugin } from '@/types';

class ConnectionPlugin implements Plugin {
  name: string;
  connectionManager: ConnectionManager;

  constructor() {
    this.name = 'ConnectionPlugin';
    this.connectionManager = new ConnectionManager();
  }

  initialize() {
    console.log(`${this.name} initialized`);
    this.connectionManager.loadConnections();
  }

  activate() {
    console.log(`${this.name} activated`);
  }

  deactivate() {
    console.log(`${this.name} deactivated`);
  }
}

export default ConnectionPlugin;
