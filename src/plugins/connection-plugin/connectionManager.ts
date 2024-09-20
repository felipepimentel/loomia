// plugins/connectionPlugin/connectionManager.ts
import { Connection } from './types';

export class ConnectionManager {
  connections: Connection[];

  constructor() {
    this.connections = [];
  }

  loadConnections() {
    // Simulate loading connections from a backend or a file
    this.connections = [
      { id: '1', source: 'shape1', target: 'shape2' },
      { id: '2', source: 'shape3', target: 'shape4' },
    ];
    console.log('Connections loaded:', this.connections);
  }

  addConnection(connection: Connection) {
    this.connections.push(connection);
    console.log('Connection added:', connection);
  }

  removeConnection(connectionId: string) {
    this.connections = this.connections.filter(conn => conn.id !== connectionId);
    console.log('Connection removed:', connectionId);
  }

  getConnections() {
    return this.connections;
  }
}
