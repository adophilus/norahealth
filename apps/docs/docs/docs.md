# NoraHealth Documentation

Welcome to NoraHealth documentation. This guide covers the architecture, design, and implementation of the NoraHealth AI wellness platform for the "Commit To Change: AI Agents Hackathon".

## Architecture

- [Architecture Overview](./architecture/overview.md) - NoraHealth system architecture, multi-agent system, and design patterns
- [Domain Layer](./architecture/domain-layer.md) - Core business logic and domain models
- [Agent System](./architecture/agent-system.md) - Multi-agent architecture using @effect/ai
- [Feature Overview](./architecture/feature-overview.md) - Complete feature breakdown
- [Data Model](./architecture/data-model.md) - Database schema and relationships
- [LLM Integration](./architecture/llm-integration.md) - @effect/ai usage with Gemini and GLM

## API Reference

Visit our [API Reference](/api) for interactive OpenAPI documentation powered by Scalar.

## Getting Started

### Development Setup

1. Clone repository
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

NoraHealth uses the [Effect library](https://effect.website/) throughout the codebase for:
- Type-safe error handling
- Composable effects and side effects
- Dependency injection via Context.Tag
- Testable, predictable code

### Multi-Agent System

NoraHealth's core innovation is its multi-agent architecture:

- **Intake & Safety Agent** - The gatekeeper that conducts empathetic onboarding and validates all plans against health constraints
- **Meal Planner Agent** - Uses vision to analyze fridge photos and generates personalized recipes
- **Exercise Coach Agent** - Builds adaptive workout routines that respond to weather conditions
- **Logistics Agent** - Connects meal plans to real-world ingredient availability via Google Maps

Agents communicate through an orchestration layer using @effect/ai, maintaining conversation context across hand-offs.

### Monorepo Structure

The project is organized as an Nx monorepo with pnpm workspaces:
- **packages/** - Shared libraries (domain, api, api-client)
- **apps/** - Applications (backend, docs, webapp, website)

### Layered Architecture

Each backend feature follows a three-layer pattern:
1. **Route** - HTTP endpoint handlers
2. **Service** - Business logic orchestration
3. **Repository** - Data access with Kysely

See [Architecture Overview](./architecture/overview.md) for details.

## Key Technologies

- **TypeScript** - Type-safe development
- **Effect** - Functional programming framework with @effect/ai
- **@effect/ai-google** - Gemini LLM integration
- **Nx** - Monorepo management
- **pnpm** - Package manager
- **Kysely** - Type-safe SQL queries
- **SQLite** - Database (for both dev and prod)
- **VitePress** - Documentation framework
- **Scalar** - API documentation generator
- **React + TanStack Router** - Frontend framework

## Feature Documentation

### Onboarding & Safety
- [Onboarding Flow](./features/onboarding.md) - Structured health profile collection
- [Safety Validation](./features/safety-validation.md) - Redline checking and health alerts

### Meal Planning
- [Fridge Vision](./features/fridge-vision.md) - Image analysis for ingredient detection
- [Recipe Generation](./features/recipe-generation.md) - AI-powered recipe creation
- [Meal Plans](./features/meal-plans.md) - Daily and weekly meal planning

### Exercise & Fitness
- [Workout Generation](./features/workout-generation.md) - Personalized workout routines
- [Weather Adaptation](./features/weather-adaptation.md) - Dynamic workout adjustments
- [Progress Tracking](./features/progress-tracking.md) - Session completion and metrics

### Marketplace
- [Ingredient Sourcing](./features/ingredient-sourcing.md) - Google Maps integration for store locations

### Notifications
- [Firebase Push](./features/firebase-push.md) - Web push notification system

## Contributing

When adding features to NoraHealth:

1. Start with domain models in `packages/domain/`
2. Define API endpoints in `packages/api/`
3. Implement backend route, service, and repository layers
4. Create database migrations
5. Update this documentation
6. Write minimal tests for happy paths

See [Architecture Overview](./architecture/overview.md) for complete development workflow.

## Guides

- [Development Workflow](./guides/development-workflow.md) - How to add new features
- [Testing](./guides/testing.md) - Minimal testing approach
- [Demo Preparation](./guides/demo-preparation.md) - Hackathon demo flow

## Support

For questions or issues, reach out through the project repository.
