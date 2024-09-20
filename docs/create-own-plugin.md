# Loomia Plugin Development Guide

## Introduction

Loomia is a collaborative whiteboard platform that utilizes a plugin-based architecture. This guide provides detailed instructions on how to create, implement, and integrate new plugins into the Loomia system.

## Basic Plugin Structure

Each plugin in Loomia consists of at least three main files:

1. `index.ts`: Contains the main plugin class.
2. `metadata.ts`: Defines the plugin's metadata.
3. `ComponentName.tsx`: The React component associated with the plugin (if applicable).

### File Location

Plugin files should be placed in a dedicated directory within `src/plugins/`. For example, for a plugin called "my-awesome-plugin":

```
src/
  plugins/
    my-awesome-plugin/
      index.ts
      metadata.ts
      MyAwesomeComponent.tsx
```

## Creating a New Plugin

### Step 1: Define Plugin Metadata

Create a `metadata.ts` file in your plugin directory:

```typescript
import { definePluginMetadata } from '@/core/plugin-metadata';

export default definePluginMetadata({
  name: "my-awesome-plugin",
  type: "tool", // Can be 'tool', 'utility', 'canvas', etc.
  description: "This plugin does awesome things!",
  version: "1.0.0",
  author: "Your Name",
  defaultSettings: {
    // Default plugin settings
    enabled: true,
    color: "#ff0000"
  }
});
```

### Step 2: Implement the Main Plugin Class

Create an `index.ts` file in your plugin directory:

```typescript
import { AbstractPlugin } from '@/core/base-plugin';
import { PluginMetadata } from '@/core/plugin-metadata';
import MyAwesomeComponent from './MyAwesomeComponent';

export default class MyAwesomePlugin extends AbstractPlugin {
  component: typeof MyAwesomeComponent | null = null;

  constructor(metadata: PluginMetadata) {
    super(metadata);
  }

  async initialize(settings: Record<string, any>): Promise<void> {
    console.log(`Initializing MyAwesomePlugin with settings:`, settings);
    this.component = MyAwesomeComponent;
    // Perform any necessary initialization here
  }

  async destroy(): Promise<void> {
    console.log(`Destroying MyAwesomePlugin`);
    this.component = null;
    // Perform any necessary cleanup here
  }

  // Implement additional methods as needed
}
```

### Step 3: Create the React Component (if applicable)

If your plugin includes a user interface, create a `MyAwesomeComponent.tsx` file:

```typescript
import React from 'react';

interface MyAwesomeComponentProps {
  // Define necessary props
}

const MyAwesomeComponent: React.FC<MyAwesomeComponentProps> = (props) => {
  return (
    <div>
      {/* Implement your component here */}
    </div>
  );
};

export default MyAwesomeComponent;
```

## Integrating the Plugin into Loomia

### Step 1: Register the Plugin

Add your plugin to the user configuration file (`src/lib/userConfig.ts`):

```typescript
export async function loadUserSettings() {
  return {
    plugins: [
      // ... other plugins
      {
        "my-awesome-plugin": {
          active: true,
          source: 'core',
          pluginSettings: {
            // Plugin-specific settings
          }
        }
      }
    ]
  };
}
```

### Step 2: Use the Plugin in the Application

In the component where you want to use the plugin (usually `App.tsx` or a top-level component):

```typescript
import { pluginManager } from '@/core/plugin-manager';

// ...

const MyAwesomePlugin = pluginManager.getPlugin('my-awesome-plugin');
if (MyAwesomePlugin && MyAwesomePlugin.component) {
  const PluginComponent = MyAwesomePlugin.component;
  return <PluginComponent />;
}
```

## Best Practices

1. **Strong Typing**: Use TypeScript to ensure strong typing throughout your plugin.
2. **Componentization**: Keep your React components small and focused.
3. **State Management**: Use React hooks for local state management. For global state, consider using Loomia's state management system (if available).
4. **Error Handling**: Implement robust error handling in your plugin.
5. **Documentation**: Document your code well and provide usage examples.
6. **Testing**: Write unit and integration tests for your plugin.

## Naming Conventions

- Use kebab-case for plugin directory names (e.g., `my-awesome-plugin`).
- Use PascalCase for plugin class names and React components (e.g., `MyAwesomePlugin`, `MyAwesomeComponent`).
- Use camelCase for plugin instance names in the configuration (e.g., `myAwesomePlugin`).

## Plugin Manager Behavior

The plugin manager will automatically convert kebab-case plugin names to camelCase when loading plugins. For example, a plugin with the directory name `my-awesome-plugin` will be loaded as `myAwesomePlugin`.

## Conclusion

By following this guide, you should be able to create and integrate new plugins into the Loomia system. Remember that the plugin architecture allows for great flexibility and extensibility, so be creative and take full advantage of the platform's potential!

For any additional questions or support, please refer to the complete Loomia documentation or contact the development team.