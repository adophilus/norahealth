# nora-health Architecture

## Overview

nora-health is a social media scheduling platform built with TypeScript, organized as a monorepo managed by Nx and pnpm. The system follows a layered architecture with strong emphasis on type safety and functional programming using Effect.

## Project Structure

```
nora-health/
├── apps/
│   ├── backend/         # Node.js/TypeScript backend service
│   ├── docs/           # VitePress documentation site
│   ├── frontend/        # Frontend application
│   ├── waitlist/       # Waitlist application
│   ├── webapp/         # Web application
│   └── website/        # Marketing website
└── packages/
    ├── api/             # API endpoint definitions and schemas
    ├── api-client/       # Generated API client for frontend
    └── domain/          # Core business logic and domain models
```

## Architecture Layers

### 1. Domain Layer (@nora-health/domain)

**Purpose**: Core business logic, types, and domain models

**Technology**: Effect Schema for runtime type safety

**Key Responsibilities**:
- Define business entities (User, Post, ConnectedAccount, etc.)
- Encode business rules and validations
- Provide type-safe domain models for entire system

**Example Models**:
- `User` - User account entity
- `Post` - Social media post entity
- `ConnectedAccount` - User's connected social platform accounts
- `OAuthToken` - OAuth credentials (separate from account metadata)
- `AuthSession` - Authentication session management
- `PostPlatform` - Post-platform relationship for multi-platform publishing

### 2. API Layer (@nora-health/api)

**Purpose**: Define API contracts, endpoints, and request/response schemas

**Technology**: @effect/platform HttpApi

**Key Responsibilities**:
- Define HTTP endpoints with Effect-based handlers
- Specify request/response types
- OpenAPI/Swagger documentation generation
- API groups organized by feature domain

**API Groups**:
- `Auth` - Authentication endpoints (OTP-based)
- `Storage` - Media file upload/management
- `User` - User profile management
- `Waitlist` - Waitlist entry management
- `Post` - Post creation, retrieval, updates
- `Integrations` - Social platform OAuth integration (in progress)

**Endpoint Pattern**:
```typescript
export const SomeEndpoint = HttpApiEndpoint.make(
  'POST', // Method
  '/path', // Route
  HttpApiEndpoint.RequestBody(schema), // Request schema
  HttpApiEndpoint.Response(schema)      // Response schema
)
```

### 3. Backend Layer (apps/backend)

**Purpose**: Implement API handlers, business logic, and data persistence

**Architecture**: Feature-based with three layers per feature

**Feature Structure**:
```
features/
├── auth/
│   ├── route/          # API endpoint handlers
│   ├── service/        # Business logic orchestration
│   ├── repository/     # Data access layer
│   ├── middleware/     # Express/HTTP middleware
│   └── cron.ts        # Scheduled tasks
├── user/
├── post/
├── storage/
├── integrations/
│   └── repository/    # ConnectedAccount, OAuthToken repositories
└── database/
    └── kysely/        # Database setup and migrations
```

**Layer Responsibilities**:

#### Route Layer
- Implements API endpoint handlers
- Calls service layer for business logic
- Handles HTTP-specific concerns (status codes, headers)
- Maps domain errors to HTTP responses

#### Service Layer
- Orchestrates business operations
- Coordinates multiple repositories
- Implements business rules and workflows
- Returns Effect-based computations

#### Repository Layer
- Data access abstraction
- Kysely-based implementations
- CRUD operations on database tables
- Type-safe queries

**Repository Pattern**:
```typescript
// Interface
export class UserRepository extends Context.Tag('UserRepository')<UserRepository, {
  findById: (id: string) => Effect.Effect<Option<User>, UserRepositoryError>
  create: (payload: User.Insertable) => Effect.Effect<User, UserRepositoryError>
  // ...
}>() {}

// Implementation
export const UserRepositoryLive = Layer.effect(
  UserRepository,
  Effect.gen(function* (_) {
    const db = yield* KyselyClient
    return UserRepository.of({
      findById: (id) => Effect.tryPromise({
        try: () => db.selectFrom('users').where('id', '=', id).executeTakeFirst(),
        catch: (error) => new UserRepositoryError({ message: String(error) })
      }).pipe(Effect.map(Option.fromNullable)),
      // ...
    })
  })
)
```

### 4. Database Layer

**Technology**: Kysely (type-safe SQL query builder) with SQLite

**Features**:
- Type-safe database queries based on TypeScript interfaces
- Database migrations via Kysely migrator
- Separate type definitions in `apps/backend/src/types.ts`

**Key Tables**:
- `users` - User accounts
- `auth_tokens` - OTP-based authentication tokens
- `auth_sessions` - User sessions
- `auth_profiles` - Authentication profiles
- `posts` - Social media posts
- `post_platform` - Post-platform relationships
- `storage_files` - Media file storage
- `connected_accounts` - Connected social platform accounts
- `oauth_tokens` - OAuth token storage (encrypted)

### 5. API Client Layer (@nora-health/api-client)

**Purpose**: Type-safe, auto-generated TypeScript clients for frontend consumption, generated from the OpenAPI schema defined in `@nora-health/api`.

**Available Clients**:
The package exports three types of clients to support different frontend architectures:

1.  **`createFetchClient`**:
    - **Technology**: `openapi-fetch`
    - **Use Case**: A lightweight, framework-agnostic client. Ideal for making direct API calls without a state management library (e.g., in vanilla JS/TS projects or for simple server-to-server communication).

2.  **`createTanstackQueryClient`**:
    - **Technology**: `openapi-react-query`
    - **Use Case**: A client factory that integrates seamlessly with TanStack Query (formerly React Query). This is the recommended client for React-based frontends, providing caching, automatic refetching, and other advanced state management features.

3.  **`makeApiClient`**:
    - **Technology**: `@effect/platform/HttpApiClient`
    - **Use Case**: An Effect-native HTTP client. This client is fully integrated with the Effect ecosystem and is intended for use in other Effect-based applications or services that need to consume the nora-health API. It provides the highest level of type safety and composability within the Effect framework.

**Benefits**:
- **End-to-End Type Safety**: The auto-generated clients ensure that frontend calls match the backend's API contract, catching potential errors at compile time.
- **No Manual API Code**: Eliminates the need to write and maintain boilerplate `fetch` code.
- **Always in Sync**: Because the clients are generated from the API definitions, they stay perfectly in sync with the backend, reducing runtime errors from mismatched schemas.

## Effect-based Architecture

**Why Effect**:
- Type-safe error handling
- Composable effects
- Dependency injection via Context.Tag
- Testable and predictable code

**Pattern Across Codebase**:
```typescript
// Define a service interface
export class SomeService extends Context.Tag('SomeService')<SomeService, {
  doSomething: (input) => Effect.Effect<Output, Error>
}>() {}

// Provide implementation
export const SomeServiceLive = Layer.effect(SomeService, Effect.gen(function* () {
  return SomeService.of({
    doSomething: (input) => Effect.gen(function* () {
      // Implementation
    })
  })
}))

// Compose in application
const AppLive = SomeLayer.pipe(
  Layer.provide(AnotherLayer),
  Layer.provide(DatabaseLayer)
)
```

## Data Flow Example

### User Authentication Flow

```
1. Frontend → POST /auth/send-sign-in-otp
   └→ Route handler (SendSignInOtpEndpointLive)
   └→ Service layer (sendSignInOtpUseCase)
      ├→ UserRepository: Check if user exists
      ├→ EmailAuthTokenService: Generate OTP token
      └→ MailerService: Send email

2. Frontend → POST /auth/verify-otp
   └→ Route handler (VerifyOtpEndpointLive)
   └→ Service layer (verifyOtpUseCase)
      ├→ AuthTokenRepository: Find token by OTP
      ├→ UserRepository: Find or create user
      ├→ AuthSessionService: Create session
      └→ Return JWT token
```

### Post Creation Flow

```
1. Frontend → POST /post
   └→ Route handler (CreatePostEndpointLive)
   └→ Service layer (createPostUseCase)
      ├→ PostRepository: Insert post record
      ├→ StorageRepository: Store media files (if any)
      ├→ PostPlatformService: Create platform relationships
      └→ Return created post

2. User updates post
   └→ Route handler (UpdatePostEndpointLive)
   └→ Service layer (updatePostUseCase)
      ├→ PostRepository: Update post record
      └→ PostPlatformRepository: Update platform relationships
```

## Security Architecture

### Authentication
- OTP-based email authentication (no passwords)
- Short-lived tokens with expiration
- JWT for session management
- HTTP middleware for request authentication

### OAuth Integration
- Separate storage of account metadata vs OAuth tokens
- Encryption requirement for access/refresh tokens
- Multiple token types: USER_TOKEN, PAGE_TOKEN, APP_TOKEN
- Token lifecycle: create, refresh, revoke

### Data Protection
- Type-safe queries prevent SQL injection (Kysely)
- Encrypted storage for sensitive data
- Validation via Effect Schema at runtime

## Development Workflow

### Adding a New Feature

1. **Domain Layer**: Define domain models and types
   ```bash
   # packages/domain/src/YourModel.ts
   ```

2. **API Layer**: Define endpoints
   ```bash
   # packages/api/src/YourFeature/
   ```

3. **Backend Implementation**:
   - Create repository interface and Kysely implementation
   - Create service with business logic
   - Create route handlers
   - Add database migration
   - Register in bootstrap.ts

4. **Update Types**: Add to apps/backend/src/types.ts

5. **Test**: Run typecheck and build
   ```bash
   pnpm typecheck
   pnpm build
   ```

## Code Quality Standards

### Linting & Formatting
- **Biome**: Primary linter and formatter
- **Config**:
  - 2 space indentation
  - Single quotes
  - 80 character line width
  - Trailing commas omitted

### TypeScript
- Strict type checking
- No `any` usage (even if Biome allows it)
- Effect Schema for runtime validation
- No `@ts-ignore` or `@ts-expect-error`

### Testing
- **Vitest** for backend tests
- Test location: `apps/backend/tests/`
- Test files follow `*.test.ts` pattern

## Key Design Patterns

### Repository Pattern
- Interface in `repository/interface.ts`
- Kysely implementation in `repository/kysely.ts`
- Error definitions in `repository/error.ts`
- Exported from `repository/index.ts`

### Service Layer Pattern
- Pure business logic orchestration
- Effect-based methods
- Dependencies injected via Context.Tag
- No database access (delegates to repositories)

### API Handler Pattern
- Map HTTP request to service call
- Handle domain errors appropriately
- Return proper HTTP status codes
- Maintain request/response schema compliance

## Monorepo Management

### Nx Commands
```bash
# Run command for specific project
nx run backend:build
nx run @nora-health/domain:typecheck

# Run for all projects
nx run-many -t build
nx run-many -t typecheck
```

### pnpm Workspaces
```bash
# Install all dependencies
pnpm install

# Run development mode
pnpm dev

# Build all projects
pnpm build

# Type check all projects
pnpm typecheck

# Lint all code
pnpm lint
```

## Environment Configuration

### Backend Configuration
- `.env.*.example` files provide templates
- Configuration loaded via `features/config/`
- Database: SQLite (development), configurable for production
- Server port: Configurable via environment variables

### Key Configuration Files
- `apps/backend/.env.local.example` - Local development
- `apps/backend/.env.staging.example` - Staging
- `apps/backend/.env.production.example` - Production

## Summary

nora-health is designed with:
- **Type Safety**: TypeScript + Effect Schema throughout
- **Layered Architecture**: Clear separation of concerns
- **Monorepo**: Shared code organized in packages
- **Modern Tooling**: Nx, pnpm, Biome, Vitest
- **Effect-based**: Functional programming with composable effects
- **Database**: Kysely + SQLite for type-safe queries
- **API-first**: Auto-generated client from API definitions

This architecture enables rapid feature development, maintainable code, and type safety across frontend and backend.
