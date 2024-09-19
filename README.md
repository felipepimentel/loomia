# Loomia

![Loomia](/imagens/loomia_sample_001.png)

**Loomia** is a modern and extensible solution for real-time visual collaboration. Designed to be lightweight, flexible, and customizable, it allows the use of plugins, expanding its functionalities. Loomia is also offline-first, ensuring that your work is not lost even without an internet connection. You can run it directly in a browser or as a desktop application using Electron.

## 🚀 Key Features

- 🔌 **Plugin System**: Extend functionality through custom plugins
- 🌐 **Real-Time Collaboration**: Work simultaneously with other users
- 🖌 **Customizable Drawing**: Create and edit shapes with ease
- 📡 **Offline-First**: Continue working even without a connection
- 🖥️ **Desktop Application**: Available as an app for Windows, macOS, and Linux

## 🛠 Technologies Used

- **React 18**: For dynamic and efficient components
- **Vite**: Ultra-fast development environment
- **TailwindCSS**: Customizable and performant styles
- **ShadCN UI**: Rich and reusable interfaces
- **Styled Components**: Component-based CSS
- **PNPM**: Efficient package management
- **Electron**: For cross-platform desktop application
- **WebSockets**: Real-time collaboration

## 🚀 How to Run the Project

### Prerequisites

- Node.js (>= 16.x)
- PNPM (>= 6.x)
- Docker (optional, for containers)
- Electron (optional, for desktop app)

### Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/felipepimentel/loomia.git
   cd loomia
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

The project will be running at `http://localhost:3000`.

### Running with Docker

1. Build the image:
   ```bash
   docker-compose build
   ```

2. Start the container:
   ```bash
   docker-compose up
   ```

The project will be available at `http://localhost:8080`.

### Desktop Application with Electron

1. Install Electron dependencies:
   ```bash
   npm install
   ```

2. Start Electron:
   ```bash
   npm run start
   ```

3. To package the application:
   ```bash
   npm run build
   ```

## 🧪 Tests and Code Quality

- Run tests:
  ```bash
  pnpm test
  ```

- Lint:
  ```bash
  pnpm lint
  ```

- Format:
  ```bash
  pnpm format
  ```

## 📂 Project Structure

```
/src
  /components    # Reusable components
  /core          # Core management
  /plugins       # Custom plugins
  /assets        # Styles and assets
  /pages         # Main pages
  /utils         # Utility functions
  /hooks         # Custom hooks
```

## 🔧 Plugin System

Each plugin follows this basic structure:

```typescript
export class ExamplePlugin {
  init() {
    // Initialization
  }

  enable() {
    // Enabling
  }

  disable() {
    // Disabling
  }
}
```

## 🛡 Security

- Sandboxing for plugin isolation
- Electron security configurations

## 👥 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b my-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin my-feature`
5. Open a Pull Request

## 🔮 Roadmap

- [ ] Project Export (images/PDFs)
- [ ] Cloud Synchronization
- [ ] Integration with Design Tools
- [ ] Mobile Version

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by the Loomia team.