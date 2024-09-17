import { useState, useCallback } from 'react';
import { Connection } from '../types';

export const useConnections = () => {
  const [connections, setConnections] = useState<Connection[]>([]);

  const addConnection = useCallback((connection: Connection) => {
    setConnections((prev) => [...prev, connection]);
  }, []);

  const updateConnection = useCallback(
    (id: string, updates: Partial<Connection>) => {
      setConnections((prev) =>
        prev.map((conn) => (conn.id === id ? { ...conn, ...updates } : conn))
      );
    },
    [],
  );

  const removeConnection = useCallback((id: string) => {
    setConnections((prev) => prev.filter((conn) => conn.id !== id));
  }, []);

  return { connections, addConnection, updateConnection, removeConnection };
};
