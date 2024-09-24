## Plugin Development Guide

### Introduction
This document provides an overview of the plugin architecture used in the Loomia project. It details the process of creating new plugins, best practices, and anti-patterns to avoid. The goal is to provide a clear and structured approach to extending the Loomia platform through plugins, ensuring maintainability, consistency, and flexibility.

### Table of Contents
- [Plugin Development Guide](#plugin-development-guide)
  - [Introduction](#introduction)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Plugin Structure](#plugin-structure)
  - [Creating a New Plugin](#creating-a-new-plugin)
  - [Plugin Metadata](#plugin-metadata)
  - [Plugin Initialization and Destruction](#plugin-initialization-and-destruction)
  - [Component Integration](#component-integration)
  - [Best Practices](#best-practices)
  - [Anti-Patterns](#anti-patterns)
  - [Example Plugin](#example-plugin)
  - [FAQs](#faqs)

---

### Overview
The plugin system in Loomia is designed to allow developers to extend the functionality of the platform without altering the core codebase. Each plugin encapsulates specific functionality, such as a toolbar, a canvas, or additional UI components. Plugins can be loaded dynamically and configured using a metadata system.

### Plugin Structure
A typical plugin consists of the following files:

- **`index.ts`**: The main entry point for the plugin. It initializes the plugin and provides metadata.
- **`PluginComponent.tsx`**: The React component that provides the UI and functionality of the plugin.
- **`metadata.ts`**: Metadata that describes the plugin's properties, default settings, and configuration schema.
- **`styles.css` (optional)**: Any styles specific to the plugin.

**Example Folder Structure:**
```
plugin-name/
│
├── index.ts
├── PluginComponent.tsx
├── metadata.ts
└── styles.css
```

### Creating a New Plugin
1. **Create a New Folder**: Create a new folder under the `src/plugins` directory with the desired plugin name.
2. **Create `index.ts`**:
   - Import the required modules.
   - Define a class that extends the `AbstractPlugin` or `BasePlugin` class.
   - Implement the necessary methods (`initialize`, `destroy`, etc.).
3. **Create `PluginComponent.tsx`**:
   - Define the UI component for the plugin.
   - Use the `PluginProps` type to define the properties the component can receive.
4. **Create `metadata.ts`**:
   - Define the metadata for the plugin using the `definePluginMetadata` function.
   - Provide default settings and the settings schema.
5. **Export the Plugin**: In the `index.ts` file, instantiate and export the plugin with its metadata.

### Plugin Metadata
Metadata is used to describe the plugin's properties, such as name, version, author, and settings. This information is crucial for the platform to understand how to load and configure the plugin.

**Example `metadata.ts`:**
```typescript
import { definePluginMetadata } from '@/core/plugin-metadata';

export default definePluginMetadata({
  name: "examplePlugin",
  type: "utility",
  description: "An example plugin for the Loomia platform.",
  version: "1.0.0",
  author: "Loomia Team",
  defaultSettings: {
    enabled: true,
    theme: "light",
  },
  settingsSchema: {
    enabled: {
      type: "boolean",
      default: true,
      description: "Whether the plugin is enabled."
    },
    theme: {
      type: "string",
      default: "light",
      description: "Theme for the plugin UI."
    }
  }
});
```

### Plugin Initialization and Destruction
Every plugin should implement the `initialize` and `destroy` methods:

- **`initialize(settings: Record<string, any>): Promise<void>`**: Called when the plugin is loaded. Use this method to set up initial states and configurations.
- **`destroy(): Promise<void>`**: Called when the plugin is unloaded. Clean up any resources or listeners here.

**Example:**
```typescript
async initialize(settings: Record<string, any>): Promise<void> {
  console.log(`Initializing plugin with settings:`, settings);
  this.settings = settings;
}

async destroy(): Promise<void> {
  console.log(`Destroying plugin`);
  // Clean up resources
}
```

### Component Integration
Each plugin should have a main component that provides its UI and functionality. The component should be a standard React component with props defined by the `PluginProps` type.

**Example `PluginComponent.tsx`:**
```typescript
import React from 'react';
import { PluginProps } from '@/core/types';

const PluginComponent: React.FC<PluginProps> = ({ theme, settings }) => {
  return (
    <div style={{ background: theme === 'dark' ? '#333' : '#fff' }}>
      <h1>Plugin Component</h1>
      <p>{settings.description}</p>
    </div>
  );
};

export default PluginComponent;
```

### Best Practices
- **Consistent Naming**: Use a consistent naming convention for all plugin files and classes.
- **Modular Components**: Each plugin should be self-contained, with minimal dependencies on other plugins or the core system.
- **Avoid Side Effects**: Do not modify global states or configurations unless absolutely necessary.
- **Type Safety**: Use TypeScript types and interfaces to ensure type safety and reduce bugs.
- **Documentation**: Document each plugin thoroughly, describing its purpose, settings, and usage.

### Anti-Patterns
- **Global State Modifications**: Avoid modifying global states or configurations directly.
- **Tight Coupling**: Do not tightly couple plugins with the core system or other plugins. This reduces flexibility and maintainability.
- **Large Components**: Break down large components into smaller, reusable components to improve readability and maintainability.
- **Ignoring Type Safety**: Not using types can lead to bugs and unexpected behaviors.

### Example Plugin
1. **Create the Plugin Directory**:
    ```
    src/plugins/example-plugin/
    ```
2. **Create `index.ts`**:
    ```typescript
    import ExamplePlugin from './ExamplePlugin';
    import metadata from './metadata';

    const pluginInstance = new ExamplePlugin(metadata);

    export { pluginInstance as default, metadata };
    ```
3. **Create `ExamplePlugin.tsx`**:
    ```typescript
    import React from 'react';
    import { AbstractPlugin, PluginMetadata } from '@/core/types';
    import PluginComponent from './PluginComponent';

    class ExamplePlugin extends AbstractPlugin {
      private component: React.FC;

      constructor(metadata: PluginMetadata) {
        super(metadata);
        this.component = this.renderComponent.bind(this);
      }

      private renderComponent(props: any): React.ReactElement {
        return <PluginComponent {...props} />;
      }

      async initialize(settings: Record<string, any>): Promise<void> {
        console.log(`Initializing Example Plugin with settings:`, settings);
      }

      async destroy(): Promise<void> {
        console.log('Destroying Example Plugin');
      }

      getComponent(): React.FC {
        return this.component;
      }
    }

    export default ExamplePlugin;
    ```
4. **Create `PluginComponent.tsx`**:
    ```typescript
    import React from 'react';
    import { PluginProps } from '@/core/types';

    const PluginComponent: React.FC<PluginProps> = ({ theme, settings }) => {
      return (
        <div style={{ background: theme === 'dark' ? '#333' : '#fff' }}>
          <h1>Example Plugin Component</h1>
          <p>{settings.description}</p>
        </div>
      );
    };

    export default PluginComponent;
    ```
5. **Create `metadata.ts`**:
    ```typescript
    import { definePluginMetadata } from '@/core/plugin-metadata';

    export default definePluginMetadata({
      name: "examplePlugin",
      type: "utility",
      description: "An example plugin for the Loomia platform.",
      version: "1.0.0",
      author: "Loomia Team",
      defaultSettings: {
        enabled: true,
        theme: "light",
      },
      settingsSchema: {
        enabled: {
          type: "boolean",
          default: true,
          description: "Whether the plugin is enabled."
        },
        theme: {
          type: "string",
          default: "light",
          description: "Theme for the plugin UI."
        }
      }
    });
    ```

### FAQs
**Q: How do I debug a plugin?**
A: Use the browser's developer tools to inspect the plugin's component and console logs. Implement comprehensive logging in the `initialize` and `destroy` methods.

**Q: Can a plugin depend on another plugin?**
A: While it's technically possible, it's recommended to avoid inter-plugin dependencies to maintain modularity and reduce complexity.

**Q: How do I handle errors in plugins?**
A: Implement error handling using `try-catch` blocks and log errors in a user-friendly manner. Ensure that errors in one plugin do not crash the entire application.
