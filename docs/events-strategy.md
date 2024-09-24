# Event Management Module Documentation

This documentation provides a comprehensive guide to the event management module for the Loomia project. It covers the structure, usage, best practices, and examples for developers working with the event system, making it easier to integrate and manage events in a scalable and maintainable way.

## Table of Contents

- [Event Management Module Documentation](#event-management-module-documentation)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Directory Structure](#directory-structure)
  - [Core Components](#core-components)
    - [EventBus](#eventbus)
    - [EventTypes](#eventtypes)
  - [Middleware](#middleware)
    - [Logging Middleware](#logging-middleware)
    - [Validation Middleware](#validation-middleware)
    - [Registering Middlewares](#registering-middlewares)
  - [Global Events](#global-events)
  - [Plugin Events](#plugin-events)
  - [Canvas Events](#canvas-events)
  - [Best Practices](#best-practices)
  - [Contribution Guide](#contribution-guide)
  - [Conclusion](#conclusion)

## Introduction

The event management module is designed to provide a robust and scalable solution for handling communication between different parts of the Loomia application. It allows for easy registration, execution, and management of events, as well as the integration of middleware for enhanced functionality.

## Directory Structure

```plaintext
/events
│
├── EventBus.ts             # Core event management class, centralizes event handling.
├── EventTypes.ts           # Type definitions and interfaces for events.
├── index.ts                # Entry point for registering middlewares and initializing the EventBus.
│
├── middleware              # Directory for event middlewares, which process events before they're emitted.
│   ├── index.ts            # Middleware registration.
│   ├── loggingMiddleware.ts
│   └── validationMiddleware.ts
│
├── plugins                 # Plugin-specific events.
│   ├── PluginEvents.ts     # Plugin-related event definitions.
│   └── index.ts            # Plugin events registration.
│
├── global                  # Global application-wide events.
│   ├── GlobalEvents.ts     # Global event definitions.
│   └── index.ts            # Global events registration.
│
└── canvas                  # Canvas-specific events.
    ├── CanvasEvents.ts     # Canvas-related event definitions.
    └── index.ts            # Canvas events registration.
```

## Core Components

### EventBus

The `EventBus` is the core of the event management system. It provides methods to register, unregister, emit, and handle events across the application.

**Key Methods:**

- **`on(event: string, callback: EventCallback, priority?: number): void`**
  Registers a new event listener with an optional priority.

- **`off(event: string, callback: EventCallback): void`**
  Unregisters an event listener.

- **`use(middleware: Middleware): void`**
  Adds middleware to be applied to all events.

- **`emit(event: string, ...args: any[]): void`**
  Emits an event, applying middlewares and invoking all registered listeners.

- **`clear(event: string): void`**
  Clears all listeners for a specific event.

**Example:**

```typescript
import { eventBus } from './EventBus';

// Register an event listener
eventBus.on('user:login', (user) => {
  console.log(`User logged in: ${user.name}`);
});

// Emit an event
eventBus.emit('user:login', { name: 'John Doe' });
```

### EventTypes

Defines the types and interfaces for events and middlewares, ensuring type safety across the module.

**Key Types:**

- **`EventCallback`**
  Represents a callback function for events.

- **`Middleware`**
  Represents a middleware function to process events before they are emitted.

- **`Event`**
  Interface representing an event structure.

```typescript
export type EventCallback = (...args: any[]) => void;
export type Middleware = (event: string, ...args: any[]) => boolean | void;
export interface Event {
  type: string;
  payload?: Record<string, any>;
}
```

## Middleware

Middleware functions are executed before events are emitted, allowing for logging, validation, or any other pre-processing logic.

### Logging Middleware

Logs every event emitted in the system.

**Location:** `/events/middleware/loggingMiddleware.ts`

```typescript
import { Middleware } from '../EventTypes';

export const loggingMiddleware: Middleware = (event, ...args) => {
  console.log(`Event emitted: ${event}`, ...args);
  return true; // Continue emitting the event
};
```

### Validation Middleware

Validates event payloads to ensure they meet expected criteria.

**Location:** `/events/middleware/validationMiddleware.ts`

```typescript
import { Middleware } from '../EventTypes';

export const validationMiddleware: Middleware = (event, ...args) => {
  if (event === 'user:login' && typeof args[0]?.userId !== 'number') {
    console.warn(`Invalid userId: ${args[0]?.userId}`);
    return false; // Block the event from being emitted
  }
  return true;
};
```

### Registering Middlewares

Middlewares are registered in the `/events/middleware/index.ts` file.

```typescript
import { eventBus } from '../EventBus';
import { loggingMiddleware } from './loggingMiddleware';
import { validationMiddleware } from './validationMiddleware';

eventBus.use(loggingMiddleware);
eventBus.use(validationMiddleware);
```

## Global Events

Global events are used for application-wide state changes or actions.

**Location:** `/events/global/GlobalEvents.ts`

```typescript
import { eventBus } from '../EventBus';

const GlobalEvents = {
  USER_LOGIN: 'global:userLogin',
  USER_LOGOUT: 'global:userLogout',
  SETTINGS_CHANGED: 'global:settingsChanged'
} as const;

eventBus.on(GlobalEvents.USER_LOGIN, (payload) => {
  console.log('User logged in:', payload);
});

export const emitUserLogin = (userId: number) => {
  eventBus.emit(GlobalEvents.USER_LOGIN, { userId });
};

export default GlobalEvents;
```

## Plugin Events

Plugin events are used to manage plugin-specific actions and state changes.

**Location:** `/events/plugins/PluginEvents.ts`

```typescript
import { eventBus } from '../EventBus';

const PluginEvents = {
  PLUGIN_REGISTERED: 'plugin:pluginRegistered',
  PLUGIN_UPDATED: 'plugin:pluginUpdated',
  PLUGIN_REMOVED: 'plugin:pluginRemoved'
} as const;

eventBus.on(PluginEvents.PLUGIN_REGISTERED, (payload) => {
  console.log('Plugin registered:', payload);
});

export const emitPluginRegistered = (pluginName: string) => {
  eventBus.emit(PluginEvents.PLUGIN_REGISTERED, { pluginName });
};

export default PluginEvents;
```

## Canvas Events

Canvas events handle actions specific to the canvas component, such as drawing and updating elements.

**Location:** `/events/canvas/CanvasEvents.ts`

```typescript
import { eventBus } from '../EventBus';

const CanvasEvents = {
  CANVAS_CREATED: 'canvas:canvasCreated',
  CANVAS_UPDATED: 'canvas:canvasUpdated',
  CANVAS_DELETED: 'canvas:canvasDeleted'
} as const;

eventBus.on(CanvasEvents.CANVAS_CREATED, (payload) => {
  console.log('Canvas created:', payload);
});

export const emitCanvasCreated = (canvasId: string) => {
  eventBus.emit(CanvasEvents.CANVAS_CREATED, { canvasId });
};

export default CanvasEvents;
```

## Best Practices

1. **Modular Structure**: Separate events based on their context (global, plugins, canvas) to improve code organization and maintainability.
2. **Use Middlewares Wisely**: Use middlewares for logging, validation, and any other pre-processing logic, avoiding complex logic in the event listeners themselves.
3. **Immutable State**: Ensure the event payloads are immutable, preventing unintended side effects.
4. **Error Handling**: Implement error handling in listeners to avoid breaking the event flow.
5. **Documentation**: Always document the events, their payloads, and expected behaviors.

## Contribution Guide

1. **Fork the Repository**: Start by forking the repository and creating a new branch for your feature or bugfix.
2. **Implement the Change**: Follow the existing patterns to implement your changes in the respective `/events` sub-directory.
3. **Testing**: Ensure that your changes are well-tested and do not break existing functionality.
4. **Pull Request**: Create a pull request with a detailed description of the changes made.

## Conclusion

The event management module provides a structured and scalable way to handle communication across the Loomia application. With its modular design, support for middlewares, and strong typing, it ensures a reliable and maintainable foundation for building complex, event-driven applications. By following the best practices and leveraging the power of this module, developers can efficiently manage the flow of data and actions throughout the application.
