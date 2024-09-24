import React from 'react';
import { AbstractPlugin, PluginMetadata, PluginProps } from '@/core/types';
import Header from './Header';

class HeaderPlugin extends AbstractPlugin {
  Component: React.FC<PluginProps>;

  constructor(metadata: PluginMetadata) {
    super(metadata);
    this.Component = this.renderComponent.bind(this);
  }

  private renderComponent(props: PluginProps): React.ReactElement {
    return <Header {...props} settings={this.settings} />;
  }

  async initialize(settings: Record<string, any>): Promise<void> {
    console.log(`Initializing HeaderPlugin with settings:`, settings);
    this.settings = settings;
  }

  async destroy(): Promise<void> {
    console.log(`Destroying HeaderPlugin`);
  }
}

export default HeaderPlugin;
