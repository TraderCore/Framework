# TraderCore

TraderCore is an open-source modular backoffice software system designed for trading operations. Built with modern web technologies, it provides a flexible and extensible platform for building administrative interfaces and managing trading operations.

## 🚀 Features

- **Modular Architecture** - Plugin-based system for extending functionality
- **Modern Tech Stack** - Built with Next.js, NestJS, and TypeScript
- **Multiple Interfaces** - Separate admin and client dashboards
- **Plugin System** - Easy to extend with custom plugins
- **CLI Tool** - Command line interface for management tasks
- **Monorepo Structure** - Organized with PNPM workspaces and Turborepo

## 📦 Project Structure

tradercore/
├── apps/
│   ├── admin-dashboard/ # Admin interface (Next.js)
│   ├── client-dashboard/ # Client interface (Next.js)
│   ├── api/ # Backend API (NestJS)
│   └── cli/ # Command Line Tool
├── core/ # Core functionality
├── plugins/
│   ├── plugin-manager/ # Plugin system
│   └── template/ # Plugin template
└── tooling/ # Shared configurations
    ├── typescript-config/
    └── jest-config/



## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19
- **Backend**: NestJS, Node.js
- **Language**: TypeScript
- **Testing**: Jest
- **Package Manager**: PNPM
- **Other Tools**: Biome (Linting/Formatting), Turbo (Build System)

## 🚦 Getting Started

1. **Prerequisites**
   - Node.js >= 22.0.0
   - PNPM >= 9.12.3

2. **Installation**

```bash
# Clone the repository
git clone https://github.com/thegoateddev/tradercore.git

# Install dependencies
pnpm install
```

3. **Development**

```bash
# Start All Apps
pnpm dev

# Start Specific App
pnpm app:admin dev # Admin Dashboard (Port 3001)
pnpm app:client dev # Client Dashboard (Port 3000)
pnpm app:api dev # API Server (Port 8080)
```

## 📝 License

TraderCore is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📚 Documentation

For detailed documentation, please visit our [documentation site](https://docs.tradercore.dev) (coming soon).

## ⚡ Performance

- Optimized build system using Turbo
- Efficient plugin architecture
- Modular loading for better resource management

## 🔒 Security

- Helmet for API security
- Built-in authentication system
- Plugin sandboxing

## 🌟 Support

For support, please open an issue in the GitHub repository or join our community channels.
