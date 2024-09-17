# Loomia Project

Welcome to **Loomia**, a Micro Frontends (MFE) project built with React, TypeScript, and Vite, organized in a monorepo using pnpm. Loomia serves as a practical example of constructing a modular and scalable web application, enabling independent development and deployment of different features or modules.

## Table of Contents

- [Loomia Project](#loomia-project)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Monorepo Structure](#monorepo-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Applications](#running-the-applications)
      - [Start the Micro Frontend (`mfe-board`)](#start-the-micro-frontend-mfe-board)
      - [Start the Host Application (`host`)](#start-the-host-application-host)
  - [Development Workflow](#development-workflow)
    - [Adding Dependencies](#adding-dependencies)
    - [Shared Packages](#shared-packages)
    - [Building for Production](#building-for-production)
  - [Project Evolution](#project-evolution)
    - [Extending Functionality](#extending-functionality)
    - [Best Practices](#best-practices)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)
  - [Contact](#contact)
  - [Additional Resources](#additional-resources)
  - [Screenshots](#screenshots)
  - [FAQ](#faq)
    - [Why use pnpm for the monorepo?](#why-use-pnpm-for-the-monorepo)
    - [How does Module Federation work with Vite?](#how-does-module-federation-work-with-vite)
    - [Can I use other frameworks or libraries?](#can-i-use-other-frameworks-or-libraries)
  - [Troubleshooting](#troubleshooting)
  - [Code of Conduct](#code-of-conduct)
  - [Roadmap](#roadmap)
  - [Feedback](#feedback)

---

## Overview

**Loomia** is designed to demonstrate:

- Building a micro frontend architecture with React and Vite.
- Using pnpm workspaces to manage a monorepo efficiently.
- Sharing code between applications through local packages.
- Implementing Module Federation with Vite for dynamic imports of remote modules.

---

## Features

- **Micro Frontend Architecture**: Independent applications (`host` and `mfe-board`) that can be developed and deployed separately.
- **Shared Packages**: Reusable UI components (`shared-ui`), utilities (`shared-utils`), and an event bus (`event-bus`).
- **TypeScript Support**: Strongly typed codebases for reliability and maintainability.
- **Vite Module Federation**: Efficient code splitting and on-demand loading of remote modules.
- **React 18**: Leveraging the latest features and improvements of React.

---

## Monorepo Structure

```
loomia/
├── apps/
│   ├── host/            # The host application
│   └── mfe-board/       # The micro frontend application
├── packages/
│   ├── shared-ui/       # Shared UI components
│   ├── shared-utils/    # Shared utilities and hooks
│   └── event-bus/       # Event bus for inter-module communication
├── node_modules/
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

---

## Getting Started

### Prerequisites

- **Node.js**: Version 16.x or higher (Node 18 recommended).
- **pnpm**: Version 7.x or higher.

### Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/felipepimentel/loomia.git
cd loomia

# Install pnpm globally if not installed
npm install -g pnpm

# Install project dependencies
pnpm install
```

### Running the Applications

#### Start the Micro Frontend (`mfe-board`)

In the root directory, run:

```bash
pnpm --filter @loomia/mfe-board run dev
```

This will start the `mfe-board` application on [http://localhost:3001](http://localhost:3001).

#### Start the Host Application (`host`)

Open another terminal in the root directory and run:

```bash
pnpm --filter @loomia/host run dev
```

This will start the `host` application on [http://localhost:3000](http://localhost:3000).

---

## Development Workflow

### Adding Dependencies

- To add a dependency to a specific package or application, use the `--filter` flag:

  ```bash
  pnpm --filter @loomia/shared-ui add your-package-name
  ```

- For dev dependencies:

  ```bash
  pnpm --filter @loomia/mfe-board add -D your-dev-package-name
  ```

### Shared Packages

- **`shared-ui`**: Contains reusable UI components like buttons, icons, and templates.
- **`shared-utils`**: Contains utility functions, hooks, and context providers.
- **`event-bus`**: Facilitates communication between different parts of the application.

### Building for Production

- Build the `mfe-board` application:

  ```bash
  pnpm --filter @loomia/mfe-board run build
  ```

- Build the `host` application:

  ```bash
  pnpm --filter @loomia/host run build
  ```

---

## Project Evolution

### Extending Functionality

- **Add New Micro Frontends**: Create new applications under the `apps/` directory and configure them with Module Federation.
- **Create More Shared Packages**: Add new packages under `packages/` to share additional code across applications.
- **Implement Advanced Features**: Integrate state management libraries, routing, or other advanced features as needed.

### Best Practices

- **Consistent Coding Standards**: Use ESLint and Prettier to maintain code quality.
- **Type Safety**: Leverage TypeScript to catch errors early.
- **Modular Design**: Keep components and utilities small and focused.
- **Documentation**: Maintain up-to-date documentation for components and utilities.

---

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**: Click the "Fork" button at the top right of the repository page.
2. **Create a Branch**: Create a new branch for your feature or bug fix.

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**: Implement your feature or fix.
4. **Commit Your Changes**: Commit with a descriptive message.

   ```bash
   git commit -am 'Add new feature'
   ```

5. **Push to Your Fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Submit a Pull Request**: Go to the original repository and create a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- **React**: A JavaScript library for building user interfaces.
- **Vite**: Next Generation Frontend Tooling.
- **pnpm**: Fast, disk space efficient package manager.
- **TypeScript**: Typed JavaScript at Any Scale.

---

## Contact

For questions or suggestions, please open an issue or contact the project maintainers.

---

## Additional Resources

- **Vite Documentation**: [https://vitejs.dev/](https://vitejs.dev/)
- **pnpm Documentation**: [https://pnpm.io/](https://pnpm.io/)
- **React Documentation**: [https://reactjs.org/](https://reactjs.org/)
- **TypeScript Documentation**: [https://www.typescriptlang.org/](https://www.typescriptlang.org/)

---

## Screenshots

*Include screenshots of the application if available to showcase functionality and UI.*

---

## FAQ

### Why use pnpm for the monorepo?

pnpm efficiently handles multiple packages with shared dependencies, saving disk space and improving installation speed. It also offers strict package management, preventing dependency conflicts.

### How does Module Federation work with Vite?

Module Federation allows multiple builds to work together by sharing or consuming modules at runtime. In Loomia, `@originjs/vite-plugin-federation` enables Module Federation in Vite, allowing dynamic importing of remote modules between the `host` and `mfe-board` applications.

### Can I use other frameworks or libraries?

Yes, Loomia's architecture allows you to integrate other libraries or frameworks as needed. However, ensure compatibility with the existing setup, especially regarding Module Federation and shared dependencies.

---

## Troubleshooting

- **Dependency Issues**: Ensure all dependencies are installed in the correct packages. Run `pnpm install` at the root if you encounter missing modules.
- **Port Conflicts**: If ports `3000` or `3001` are in use, update the `vite.config.ts` files in `host` and `mfe-board` to use different ports.
- **Version Mismatches**: Keep dependencies up-to-date and ensure compatibility across packages. Check for peer dependency warnings during installation.
- **ES Module Errors**: Ensure that your `vite.config.ts` files use ES Module syntax (`import`/`export`) and that Node.js version is 14 or higher.

---

## Code of Conduct

Please read the [Code of Conduct](CODE_OF_CONDUCT.md) to understand the expectations for participation in this project.

---

## Roadmap

- [ ] **User Authentication**: Implement authentication and authorization mechanisms.
- [ ] **Testing**: Add unit and integration tests using Jest and React Testing Library.
- [ ] **CI/CD Pipelines**: Set up continuous integration and deployment workflows with GitHub Actions or another CI tool.
- [ ] **Documentation**: Expand documentation with detailed guides, API references, and component libraries.
- [ ] **State Management**: Integrate a state management library like Redux or Zustand.
- [ ] **Internationalization**: Add support for multiple languages.

---

## Feedback

Your feedback is valuable! Please open an issue for any feature requests, bugs, or enhancements. We are committed to improving Loomia and appreciate your contributions.

---

Happy coding with **Loomia**! 🚀