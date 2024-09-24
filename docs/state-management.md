# Global State Management with Zustand

This documentation covers the implementation and usage of global and plugin-related states using the Zustand library. The current structure allows for efficient and scalable state management.

## Directory Structure

```plaintext
/state
│
├── hooks
│   ├── global
│   │   ├── useUser.ts
│   │   ├── useSettings.ts
│   │   ├── useSetUser.ts
│   │   └── useSetSettings.ts
│   └── plugin
│       ├── usePlugins.ts
│       ├── useRegisterPlugin.ts
│       ├── useUpdatePluginData.ts
│       └── useTogglePlugin.ts
│
├── stores
│   ├── globalStore.ts
│   └── pluginStore.ts
│
└── index.ts
```

## Setup and Usage

### 1. **Global Store (`globalStore.ts`)**

The `globalStore` is responsible for managing the global application state, including user and general settings.

#### Structure

```typescript
type User = {
  name: string;
  email: string;
};

type Settings = {
  theme: 'light' | 'dark';
  language: string;
};
```

#### Available Functions

- **`setUser(user: User): void`**
  Updates the current user in the global state.

- **`setSettings(settings: Partial<Settings>): void`**
  Updates global settings with the provided values.

#### Usage Example

```typescript
import { useUser, useSetUser } from './state';

const UserProfile = () => {
  const user = useUser();
  const setUser = useSetUser();

  useEffect(() => {
    setUser({ name: 'John Doe', email: 'john.doe@example.com' });
  }, [setUser]);

  return <div>{user?.name}</div>;
};
```

### 2. **Plugin Store (`pluginStore.ts`)**

The `pluginStore` manages the state related to plugins registered in the application.

#### Structure

```typescript
type Plugin = {
  name: string;
  version: string;
  isEnabled: boolean;
  data: Record<string, any>;
};
```

#### Available Functions

- **`registerPlugin(name: string, plugin: Omit<Plugin, 'name'>): void`**
  Registers a new plugin in the application.

- **`updatePluginData(name: string, data: Partial<Plugin['data']>): void`**
  Updates the data of a specific plugin.

- **`togglePlugin(name: string): void`**
  Toggles the activation state of a plugin (enabled/disabled).

#### Usage Example

```typescript
import { usePlugins, useRegisterPlugin } from './state';

const PluginManager = () => {
  const plugins = usePlugins();
  const registerPlugin = useRegisterPlugin();

  useEffect(() => {
    registerPlugin('examplePlugin', {
      version: '1.0.0',
      isEnabled: true,
      data: {},
    });
  }, [registerPlugin]);

  return (
    <ul>
      {Object.keys(plugins).map((key) => (
        <li key={key}>{plugins[key].name}</li>
      ))}
    </ul>
  );
};
```

### 3. **Custom Hooks**

#### Global Hooks

- **`useUser()`**
  Returns the current user stored in the global state.

- **`useSettings()`**
  Returns the global settings of the application.

- **`useSetUser()`**
  Returns the `setUser` function to update the user in the global state.

- **`useSetSettings()`**
  Returns the `setSettings` function to update the global settings.

#### Plugin Hooks

- **`usePlugins()`**
  Returns all the plugins registered in the application.

- **`useRegisterPlugin()`**
  Returns the `registerPlugin` function to register new plugins.

- **`useUpdatePluginData()`**
  Returns the `updatePluginData` function to update the data of a specific plugin.

- **`useTogglePlugin()`**
  Returns the `togglePlugin` function to toggle the activation state of a plugin (enabled/disabled).

### 4. **Simplified Import**

To simplify the import of hooks and stores, use the centralized export provided by the `index.ts` file:

```typescript
// Centralized Import
import { useUser, useSetUser, usePlugins, useRegisterPlugin } from './state';
```

### 5. **Best Practices**

- **Use of Selectors**: Use specific hooks to access only the parts of the state you actually need. This avoids unnecessary re-renders.
- **Immutable State Maintenance**: Zustand, together with `immer`, allows for immutable state manipulation, ensuring safety and predictability.
- **Segregation of Responsibilities**: Keep hooks and stores separated by context (global and plugin) to improve code organization and maintainability.

### 6. **Contribution**

To contribute with improvements or adjustments to the state management, follow these steps:

1. **Fork** the repository and create a new branch with the feature or bugfix you want to implement.
2. **Implement** the change in the corresponding files within the `/state` directory.
3. **Test** the change locally to ensure there are no regressions.
4. **Create a Pull Request** with a clear description of the change implemented.
