import React from 'react';
import { AbstractPlugin, PluginMetadata, PluginProps } from '@/core/types';
import BottomToolbar from './BottomToolbar';

class BottomToolbarPlugin extends AbstractPlugin {
  Component: React.FC<PluginProps>;

  constructor(metadata: PluginMetadata) {
    super(metadata);
    this.Component = this.renderComponent.bind(this);
  }

  private renderComponent(props: PluginProps): React.ReactElement {
    // Usar JSX corretamente dentro de arquivo .tsx
    return <BottomToolbar {...props} settings={this.settings} />;
  }

  async initialize(settings: Record<string, any>): Promise<void> {
    console.log(`Initializing BottomToolbarPlugin with settings:`, settings);
    this.settings = settings;
  }

  async destroy(): Promise<void> {
    console.log(`Destroying BottomToolbarPlugin`);
  }
}

export default BottomToolbarPlugin;
