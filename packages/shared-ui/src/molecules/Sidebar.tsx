import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Icon } from '../atoms/Icon';

export const Sidebar: React.FC = () => {
  return (
    <div className="sidebar" style={{ width: '250px', backgroundColor: '#fafafa', borderRight: '1px solid #ddd' }}>
      <Tabs.Root defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">
            <Icon name="Layers" size={20} /> Layers
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2">
            <Icon name="Settings" size={20} /> Settings
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">
          {/* Conteúdo da aba Layers */}
          <div style={{ padding: '8px' }}>Layers content...</div>
        </Tabs.Content>
        <Tabs.Content value="tab2">
          {/* Conteúdo da aba Settings */}
          <div style={{ padding: '8px' }}>Settings content...</div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};
