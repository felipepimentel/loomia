// src/plugins/bottom-toolbar-plugin/BottomToolbarPlugin.ts
import React from 'react';
import { AbstractPlugin, PluginMetadata, PluginProps } from '@/core/types';
import BottomToolbarRender from './BottomToolbarRender';

class BottomToolbarPlugin extends AbstractPlugin {
  Component: React.FC<PluginProps>;

  constructor(metadata: PluginMetadata) {
    super(metadata);
    this.Component = this.renderComponent.bind(this);
  }

  private renderComponent(props: PluginProps): React.ReactElement {
    return React.createElement(BottomToolbarRender, { ...props, settings: this.settings });
  }

  async initialize(settings: Record<string, any>): Promise<void> {
    console.log(`Initializing BottomToolbarPlugin with settings:`, settings);
    this.settings = settings;
  }

  async destroy(): Promise<void> {
    console.log(`Destroying BottomToolbarPlugin`);
  }
}

const metadata: PluginMetadata = {
  name: "Bottom Toolbar Plugin",
  version: "1.0.0",
  description: "Provides the bottom toolbar functionality",
  author: "Your Name"
};

export default new BottomToolbarPlugin(metadata);
