# Documentation

Welcome to nora-health documentation. This guide covers the architecture, design, and implementation of the nora-health platform.

## Architecture

- [Architecture Overview](./architecture/overview.md) - System architecture, project structure, and design patterns
- [Domain Layer](./architecture/domain-layer.md) - Core business logic and domain models
- [OAuth Integration Models](./architecture/domain-models-oauth.md) - OAuth token and connected account architecture

## API Reference

Visit our [API Reference](/api) for interactive OpenAPI documentation powered by Scalar.

## Getting Started

### Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start development:
   ```bash
   pnpm dev
   ```

### Running Commands

```bash
# Type check all projects
pnpm typecheck

# Build all projects
pnpm build

# Lint all code
pnpm lint

# Run tests
pnpm test
```

## Core Concepts

### Effect-based Architecture

nora-health uses the [Effect library](https://effect.website/) throughout the codebase for:
- Type-safe error handling
- Composable effects and side effects
- Dependency injection via Context.Tag
- Testable, predictable code

### Monorepo Structure

The project is organized as an Nx monorepo with pnpm workspaces:
- **packages/** - Shared libraries (domain, api, api-client)
- **apps/** - Applications (backend, docs, frontend, webapp)

### Layered Architecture

Each backend feature follows a three-layer pattern:
1. **Route** - HTTP endpoint handlers
2. **Service** - Business logic orchestration
3. **Repository** - Data access with Kysely

See [Architecture Overview](./architecture/overview.md) for details.

## Key Technologies

- **TypeScript** - Type-safe development
- **Effect** - Functional programming framework
- **Nx** - Monorepo management
- **pnpm** - Package manager
- **Kysely** - Type-safe SQL queries
- **SQLite** - Database (configurable)
- **VitePress** - Documentation framework
- **Scalar** - API documentation generator

## Contributing

When adding features:

1. Start with domain models in `packages/domain/`
2. Define API endpoints in `packages/api/`
3. Implement backend route, service, and repository layers
4. Create database migrations
5. Update this documentation

See [Architecture Overview](./architecture/overview.md) for the complete development workflow.

## Support

For questions or issues, reach out on [Farcaster](https://farcaster.xyz/nora-health).
