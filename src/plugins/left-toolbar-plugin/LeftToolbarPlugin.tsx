import React from 'react';
import { AbstractPlugin, PluginMetadata, PluginProps } from '@/core/types';
import LeftToolbar from './LeftToolbar';

class LeftToolbarPlugin extends AbstractPlugin {
  Component: React.FC<PluginProps>;

  constructor(metadata: PluginMetadata) {
    super(metadata);
    this.Component = this.renderComponent.bind(this);
  }

  private renderComponent(props: PluginProps): React.ReactElement {
    return <LeftToolbar {...props} settings={this.settings} />;
  }

  async initialize(settings: Record<string, any>): Promise<void> {
    console.log(`Initializing LeftToolbarPlugin with settings:`, settings);
    this.settings = settings;
  }

  async destroy(): Promise<void> {
    console.log(`Destroying LeftToolbarPlugin`);
  }
}

export default LeftToolbarPlugin;
