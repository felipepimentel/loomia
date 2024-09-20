import { definePluginMetadata } from '@/core/plugin-metadata';

export default definePluginMetadata({
  name: "canvasPlugin",
  type: "canvas",
  description: "Core canvas plugin providing drawing capabilities.",
  version: "1.0.0",
  author: "Loomia Team",
  defaultSettings: {
    theme: "light",
    language: "en",
    showGrid: false
  },
  settingsSchema: {
    theme: {
      type: "string",
      default: "light",
      description: "UI theme for the canvas"
    },
    language: {
      type: "string",
      default: "en",
      description: "Language for the canvas UI"
    },
    showGrid: {
      type: "boolean",
      default: false,
      description: "Whether to show grid on the canvas"
    }
  }
});