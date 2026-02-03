# Agent Guidelines for nora-health

This document provides essential information for AI agents working within the `nora-health` codebase.

## 1. Project Overview

This is a TypeScript/Node.js monorepo managed by `nx` and `pnpm`. The primary application is a backend service.

## 2. Essential Commands

All commands should be run using `pnpm` in the root directory. `nx` orchestrates commands across projects within the monorepo.

-   **Install Dependencies**:
    ```bash
    pnpm install
    ```
-   **Development Mode**: Starts all projects in development mode.
    ```bash
    pnpm dev
    ```
-   **Build All Projects**: Builds all applications and packages.
    ```bash
    pnpm build
    ```
-   **Build Specific Projects**:
    ```bash
    pnpm build:backend   # Builds only the backend application
    pnpm build:docs      # Builds only the documentation application
    ```
-   **Start Specific Projects**:
    ```bash
    pnpm start:backend   # Starts the backend application
    pnpm start:docs      # Starts the documentation application
    ```
-   **Lint Code**: Runs `biome` linter across all projects.
    ```bash
    pnpm lint
    ```
-   **Type Check**: Runs TypeScript type checking across all projects.
    ```bash
    pnpm typecheck
    ```
-   **Run Tests**: Executes tests for all projects (uses `vitest` for backend).
    ```bash
    pnpm test
    ```

## 3. Code Organization and Structure

The codebase follows a monorepo structure with applications under `apps/` and shared packages under `packages/`.

-   **`apps/`**: Contains standalone applications.
    -   `apps/backend/`: The main Node.js/TypeScript backend service.
    -   `apps/frontend/`: The frontend application.
    -   `apps/docs/`: Documentation application.
-   **`packages/`**: Contains shared libraries and utilities.
    -   `packages/api/`: Shared API definitions or client-side generation.
    -   `packages/domain/`: Core business logic, domain models, and shared types.
    -   `packages/vite-plugin-stylex/`: Custom Vite plugin.

### Backend (`apps/backend/src/`) Structure

The backend is organized by features, with a layered architecture within each feature:

-   **`features/<feature-name>/`**: Contains all code related to a specific feature (e.g., `auth`, `config`, `mailer`, `storage`).
    -   **`route/`**: Defines API endpoints and their handlers (e.g., `SendSignInOtpEndpoint.ts`).
    -   **`service/`**: Implements business logic and orchestrates operations.
    -   **`repository/`**: Handles data access logic, interacting with the database.
    -   **`middleware/`**: Contains Express.js or similar middleware (e.g., `AuthenticationMiddleware.ts`).
    -   **`cron.ts`**: For scheduled tasks.
-   **`types.ts`**: Global or shared type definitions.
-   **`bootstrap.ts`**: Application startup and initialization logic.
-   **`app.ts`**: Main application entry point.

## 4. Naming Conventions and Style Patterns

-   **Language**: TypeScript is the primary language.
-   **Formatting & Linting**: `biome` is used to enforce code style.
    -   Indent style: 2 spaces.
    -   Quote style: Single quotes.
    -   Semicolons: As needed (not strictly enforced at end of statements).
    -   Trailing commas: None.
    -   Line width: 80 characters.
-   **TypeScript Specifics**:
    -   `noExplicitAny` rule is `off` in `biome.json`, so agents should be mindful of type safety even when `any` is allowed.
    -   PascalCase for type names, interfaces, enums, and classes.
    -   camelCase for variables, functions, and object properties.

## 5. Testing Approach

-   **Framework**: `vitest` is used for testing, particularly within the `apps/backend` project.
-   **Test Location**: Tests for a project are typically found in a `tests/` directory within that project (e.g., `apps/backend/tests/`).
-   **Running Tests**: Use `pnpm test` from the root to run all tests or `nx test <project-name>` for specific projects.

## 6. Important Gotchas and Non-Obvious Patterns

-   **NX Monorepo Management**: Always use `pnpm` and `nx` commands for running scripts, building, testing, and linting, as they correctly handle inter-project dependencies and caching.
-   **Database Interactions**: The backend uses `Kysely` for type-safe SQL query building and database migrations, as indicated by `kysely.config.ts` and `features/database/kysely/` files. Database schema and migration management are handled through this.
-   **Environment Variables**: Configuration relies on `.env.*.example` files, which should be replicated as `.env` files for local development. Configuration is likely loaded via `features/config/`.

## 7. Error Handling Patterns

### **Core Principles**

#### **Error Class Structure**
- **Always extend `Data.TaggedError`** for type safety
- **Include `cause?: unknown`** to preserve error chains
- **Message field is conditional** based on error type

#### **When to Include Message Fields**
**Include `message: string` when:**
- Repository errors (e.g., `'Failed to create health profile'`)
- Generic operation errors
- Errors that require additional context beyond the type name
- Errors that might be handled programmatically by consumers

#### **When to Omit Message Fields**
**Omit `message: string` when:**
- Error name is self-explanatory (e.g., `NotFoundError`)
- Domain-level not found errors (except in domain/api package)
- Errors where the type alone conveys all necessary information
- Specialized business logic errors

### **Error Class Patterns**

#### **Repository Layer**
```typescript
// apps/backend/src/features/health-profile/repository/error.ts
export class HealthProfileRepositoryError extends Data.TaggedError(
  'HealthProfileRepositoryError'
)<{ message: string; cause?: unknown }> {}

// Self-explanatory errors don't need messages
export class HealthProfileRepositoryNotFoundError extends Data.TaggedError(
  'HealthProfileRepositoryNotFoundError'
)<{ cause?: unknown }> {}
```

#### **Service Layer**
```typescript
// apps/backend/src/features/health-profile/service/error.ts
export class HealthProfileServiceError extends Data.TaggedError(
  'HealthProfileServiceError'
)<{ message: string; cause?: unknown }> {}

// Self-explanatory errors remain minimal
export class HealthProfileServiceNotFoundError extends Data.TaggedError(
  'HealthProfileServiceNotFoundError'
)<{ cause?: unknown }> {}
```

### **Layer-Specific Error Handling**

#### **Repository Layer Responsibilities**
- Wrap database operation failures with appropriate errors
- Include concise messages for generic database failures
- Preserve original database errors in `cause` field
- Use self-explanatory error types for common scenarios (not found)

**Example from HealthProfile Repository:**
```typescript
// apps/backend/src/features/health-profile/repository/kysely.ts
create: (healthProfile) =>
  Effect.tryPromise({
    try: () =>
      db
        .insertInto('health_profiles')
        .values({
          user_id: healthProfile.user_id,
          name: healthProfile.name,
          // ... other fields
        })
        .executeTakeFirstOrThrow(),
    catch: (error) =>
      new HealthProfileRepositoryError({
        message: 'Failed to create health profile',
        cause: error
      })
  })

findById: (id) =>
  Effect.tryPromise({
    try: () =>
      db
        .selectFrom('health_profiles')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst(),
    catch: (error) =>
      new HealthProfileRepositoryError({
        message: `Failed to find health profile by id: ${id}`,
        cause: error
      })
  }).pipe(
    Effect.flatMap((healthProfile) =>
      healthProfile
        ? Effect.succeed(healthProfile)
        : Effect.fail(new HealthProfileRepositoryNotFoundError({}))
    )
  )
```

#### **Service Layer Responsibilities**  
- Transform repository errors to service errors
- Add business logic validation errors
- Maintain error chains through `cause` field
- Create domain-specific error types as needed

**Example from HealthProfile Service:**
```typescript
// apps/backend/src/features/health-profile/service/live.ts
findById: (id) =>
  healthProfileRepository.findById(id).pipe(
    Effect.catchTags({
      HealthProfileRepositoryNotFoundError: (error) =>
        new HealthProfileServiceNotFoundError({
          cause: error
        }),
      HealthProfileRepositoryError: (error) =>
        new HealthProfileServiceError({
          message: error.message,
          cause: error
        })
    })
  ),

create: (healthProfile) =>
  Effect.gen(function* () {
    const createdHealthProfile = yield* healthProfileRepository.create(healthProfile)
    return createdHealthProfile
  }).pipe(
    Effect.catchTags({
      HealthProfileRepositoryError: (error) =>
        new HealthProfileServiceError({
          message: error.message,
          cause: error
        })
    })
  )
```

### **Error Transformation Patterns**

#### **Preserving Error Chains**
```typescript
Effect.catchTags({
  HealthProfileRepositoryError: (error) =>
    new HealthProfileServiceError({
      message: error.message,
      cause: error  // Always preserve the original error
    }),
  HealthProfileRepositoryNotFoundError: (error) =>
    new HealthProfileServiceNotFoundError({
      cause: error  // Preserve chain even for self-explanatory errors
    })
})
```

#### **Message Crafting Guidelines**
- **Repository messages**: Concise, operation-specific (e.g., `'Failed to create health profile'`)
- **Include context**: Add identifiers when helpful (e.g., `'Failed to find health profile by id: ${id}'`)
- **Avoid verbosity**: Never include stack traces or detailed error info in messages
- **Use cause field**: Store detailed error information in the `cause` field

### **Advanced Patterns**

#### **Union Error Types**
```typescript
export type HealthProfileServiceOperationError =
  | HealthProfileServiceError
  | HealthProfileServiceNotFoundError
  | HealthProfileServiceValidationError
```

#### **Error Detection and Specialization**
```typescript
// apps/backend/src/features/user/repository/kysely.ts - Example of constraint detection
catch: (error) => {
  const matches = [...(error as Error).message.matchAll(
    /^SqliteError: UNIQUE constraint failed: index '(.*?)'$/g
  )]
  
  if (matches.length) {
    return new UserRepositoryEmailAlreadyInUseError({
      email: healthProfile.email
    })
  }
  
  return new UserRepositoryError({
    message: `Failed to create user: ${error instanceof Error ? error.message : String(error)}`,
    cause: error
  })
}
```

### **Design Rationale**

1. **Type Safety**: Using `Data.TaggedError` provides compile-time type safety for error handling
2. **Debuggability**: The `cause` field maintains full error chains for debugging
3. **Maintainability**: Consistent patterns make it easy to add new operations
4. **Testability**: Well-structured errors are easier to test and mock
5. **Observability**: Structured errors work well with logging and monitoring systems

### **When to Choose Which Pattern**

**For Repository Errors:**
- Always include `message: string` for database operation failures
- Use specialized not found errors without messages for lookup operations
- Always preserve the original database error in `cause`

**For Service Errors:**
- Include `message: string` when transforming repository errors
- Use self-explanatory error types without messages for domain concepts
- Always preserve repository errors as `cause` to maintain error chains

**For Domain-Level Errors:**
- Follow the same patterns but consider the specific domain context
- Some domain errors may benefit from additional contextual data fields
