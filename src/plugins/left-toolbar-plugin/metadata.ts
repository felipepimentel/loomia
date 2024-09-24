import { PluginMetadata } from '@/core/types';

const metadata: PluginMetadata = {
  name: "Left Toolbar Plugin",
  version: "1.0.0",
  description: "Provides the left toolbar functionality for the Loomia whiteboard",
  author: "Loomia Team",
  type: "utility",
  defaultSettings: {
    tool: 'select'
  }
};

export default metadata;
