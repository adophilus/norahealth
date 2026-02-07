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

### Feature-Specific Structure

Each feature directory should contain:
-   `route/` - API endpoints (definitions in `packages/api/` package)
-   `use-case/` - Business logic use cases
-   `service/` - Service layer orchestration
-   `repository/` - Data access layer
-   `middleware/` - Feature-specific middleware (if applicable)

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

## 7. API Endpoint Architecture

### Separation of Concerns

**API Definitions (`@nora-health/api` package)**:
- Contains only endpoint definitions (schemas, request/response types)
- Uses `HttpApiEndpoint` from `@effect/platform`
- Defines the contract/interface between client and backend
- Should NOT import from backend features

**Backend Implementation (`@nora-health/backend` package)**:
- Contains route handlers that implement the API contracts
- Import endpoint definitions from `@nora-health/api`
- Call services/use-cases to fulfill requests
- Use `HttpApiBuilder.handler()` to create handlers

### Creating New Endpoints

When adding new endpoints:

1. **Define in `@nora-health/api`**:
   - Create endpoint file: `packages/api/src/<feature>/<EndpointName>Endpoint.ts`
   - Define request body schema using Schema.Class
   - Define response schema using Schema.Class or Schema.Struct
   - Configure HTTP method, path, status codes, error types

2. **Implement in `@nora-health/backend`**:
   - Create route file: `apps/backend/src/features/<feature>/route/<EndpointName>Endpoint.ts`
   - Import endpoint definition from `@nora-health/api`
   - Import required services from `@nora-health/api/common` (errors) and feature services
   - Use `HttpApiBuilder.handler(Api, 'Feature', 'endpointName')` to create handler
   - Call services/use-cases within Effect.gen to implement business logic
   - Return appropriate response types matching API definition

### Example Pattern

**API Definition** (`packages/api/src/User/CompleteOnboardingEndpoint.ts`):
```typescript
import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { EmptyMessage, HealthProfile } from '../common'
import _ from 'lodash'

export class CompleteOnboardingRequestBody extends Schema.Class<CompleteOnboardingRequestBody>(
  'CompleteOnboardingRequestBody'
)(
  _.omit(HealthProfile.fields, [
    'id',
    'user_id',
    'email',
    'created_at',
    'updated_at'
  ])
) {}

const CompleteOnboardingEndpoint = HttpApiEndpoint.put(
  'completeOnboarding',
  '/user/onboarding'
)
  .setPayload(CompleteOnboardingRequestBody)
  .addSuccess(EmptyMessage, { status: StatusCodes.NO_CONTENT })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(
    OpenApi.Description,
    'Complete user onboarding and generate initial meal plan'
  )

export default CompleteOnboardingEndpoint
```

**Backend Implementation** (`apps/backend/src/features/user/route/CompleteOnboardingEndpoint.ts`):
```typescript
import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { EmptyMessage, UnexpectedError } from '@nora-health/api/common/index'
import { Effect } from 'effect'
import { completeOnboardingUseCase } from '../use-case/complete-onboarding'

export const CompleteOnboardingEndpointLive = HttpApiBuilder.handler(
  Api,
  'User',
  'completeOnboarding',
  ({ payload }) =>
    Effect.gen(function* () {
      const currentUser = yield* CurrentUser

      yield* completeOnboardingUseCase(payload, currentUser)

      return new EmptyMessage({})
    }).pipe(
      Effect.mapError(() => {
        return new UnexpectedError({
          message: "Failed to complete user's onboarding"
        })
      })
    )
)
```

### Endpoint Response Patterns

- **Use EmptyMessage** for endpoints that return 204 NO_CONTENT
- **Use Schema.Struct** for response bodies with multiple fields
- **Use Schema.Class** for request/response objects
- **Use lodash's omit helper** to efficiently exclude fields from domain schemas
- **Status codes** should be defined in the API endpoint definition, not set dynamically in backend

## 8. Use-Case Structure

Each feature should have a `use-case/` directory that contains business logic orchestration.

### Use-Case File Pattern

```typescript
import type { RequestType } from '@nora-health/api'
import type { DomainType } from '@nora-health/domain'
import { Effect } from 'effect'
import { ServiceA, ServiceB } from '../service'

export const useCaseName = (
  request: RequestType,
  context: ContextType
) =>
  Effect.gen(function* () {
    const serviceA = yield* ServiceA
    const serviceB = yield* ServiceB

    // Business logic here

    return result
  })
```

### Use-Case Index

Each use-case directory MUST have an `index.ts` file that exports all use-cases:

```typescript
export * from './use-case-1'
export * from './use-case-2'
export * from './use-case-3'
```

This ensures:
- Discoverability - Easy to find all use-cases in a feature
- Clean imports - Can import from `feature/use-case` instead of individual files
- Consistency - All use-cases follow the same export pattern

## 9. Domain Model Export Patterns

### Multiple Exports in One File

When a domain model file exports multiple items (schemas, types, etc.), use **named exports**:

**❌ AVOID:**
```typescript
export default class Meal extends Schema.Class<Meal>('Meal')({...})
export type FoodClass = typeof FoodClass
```

**✅ USE:**
```typescript
export class Meal extends Schema.Class<Meal>('Meal')({...})
export type FoodClass = typeof FoodClass
export type Allergen = typeof Allergen
```

**DO NOT use default export** when a file exports multiple things.

### Domain Index Re-exports

In `packages/domain/src/index.ts`, re-export using wildcard imports:

```typescript
export * from './Meal'           // Exports Meal class, FoodClass, Allergen, etc. types
export * from './HealthProfile'    // Exports HealthProfile class and all type exports
export { default as User } from './User'  // Re-exports default as default
```

### Schema Type Exports

For schemas that are both types AND values (like `FoodClass`, `Allergen`, `FitnessGoal`), create type exports:

```typescript
export type FoodClass = typeof FoodClass
export type Allergen = typeof Allergen
export type FitnessGoal = typeof FitnessGoal
```

This allows consumers to use these as types in type annotations.

## 10. Complex Type Handling in Services

### Pattern for Complex Domain Fields

When dealing with domain models that have complex fields (arrays, objects) that need special handling:

1. **Define complex field types**:
```typescript
type ComplexKeys =
  | 'injuries'
  | 'medical_conditions'
  | 'fitness_goals'
  | 'allergies'
  | 'location'

type ComplexFields = {
  injuries: HealthProfile['injuries']
  medical_conditions: HealthProfile['medical_conditions']
  fitness_goals: HealthProfile['fitness_goals']
  allergies: HealthProfile['allergies']
  location: HealthProfile['location']
}
```

2. **Use in service interface signatures**:
```typescript
create(
  payload: Omit<THealthProfile.Insertable, 'id' | ComplexKeys> & ComplexFields
): Effect.Effect<HealthProfile, ErrorType>
```

This elegantly:
- Excludes certain fields from Insertable/Updateable types
- But FORCES inclusion of complex fields in their proper forms
- Avoids manual field repetition

### Lodash Helper for Request Body Schemas

When creating request body schemas in API package that need to omit fields:

```typescript
import _ from 'lodash'

export class CompleteOnboardingRequestBody extends Schema.Class<CompleteOnboardingRequestBody>(
  'CompleteOnboardingRequestBody'
)(
  _.omit(HealthProfile.fields, [
    'id',
    'user_id',
    'email',
    'created_at',
    'updated_at'
  ])
) {}
```

This is cleaner and less error-prone than manual field listing.

## 11. Error Handling Patterns

### Core Principles

#### Error Class Structure
- **Always extend `Data.TaggedError`** for type safety
- **Include `cause?: unknown`** to preserve error chains
- **Message field is conditional** based on error type

#### When to Include Message Fields
**Include `message: string` when:**
- Repository errors (e.g., `'Failed to create health profile'`)
- Generic operation errors
- Errors that require additional context beyond the type name
- Errors that might be handled programmatically by consumers

#### When to Omit Message Fields
**Omit `message: string` when:**
- Error name is self-explanatory (e.g., `NotFoundError`)
- Domain-level not found errors (except in domain/api package)
- Errors where the type alone conveys all necessary information
- Specialized business logic errors

### Error Class Patterns

#### Repository Layer
```typescript
export class HealthProfileRepositoryError extends Data.TaggedError(
  'HealthProfileRepositoryError'
)<{
  message: string
  cause?: unknown
}> {}

export class HealthProfileRepositoryNotFoundError extends Data.TaggedError(
  'HealthProfileRepositoryNotFoundError'
)<{
  cause?: unknown
}> {}
```

#### Service Layer
```typescript
export class HealthProfileServiceError extends Data.TaggedError(
  'HealthProfileServiceError'
)<{
  message: string
  cause?: unknown
}> {}

export class HealthProfileServiceNotFoundError extends Data.TaggedError(
  'HealthProfileServiceNotFoundError'
)<{
  cause?: unknown
}> {}
```

### Layer-Specific Error Handling

#### Repository Layer Responsibilities
- Wrap database operation failures with appropriate errors
- Include concise messages for generic database failures
- Preserve original database errors in `cause` field
- Use self-explanatory error types for common scenarios (not found)

#### Service Layer Responsibilities  
- Transform repository errors to service errors
- Add business logic validation errors
- Maintain error chains through `cause` field
- Create domain-specific error types as needed

#### Transforming Errors

```typescript
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
```

### Advanced Patterns

#### Union Error Types
```typescript
export type HealthProfileServiceOperationError =
  | HealthProfileServiceError
  | HealthProfileServiceNotFoundError
  | HealthProfileServiceValidationError
```

#### Error Detection and Specialization
```typescript
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

### Message Crafting Guidelines
- **Repository messages**: Concise, operation-specific (e.g., `'Failed to create health profile'`)
- **Include context**: Add identifiers when helpful (e.g., `'Failed to find health profile by id: ${id}'`)
- **Avoid verbosity**: Never include stack traces or detailed error info in messages
- **Use cause field**: Store detailed error information in the `cause` field

### Design Rationale

1. **Type Safety**: Using `Data.TaggedError` provides compile-time type safety for error handling
2. **Debuggability**: The `cause` field maintains full error chains for debugging
3. **Maintainability**: Consistent patterns make it easy to add new operations
4. **Testability**: Well-structured errors are easier to test and mock
5. **Observability**: Structured errors work well with logging and monitoring systems

### When to Choose Which Pattern

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

## 12. Implementation Decisions Made

### Removed from Scope
- ❌ Recipe entity - Too complex for current needs
- ❌ Ingredient entity - Not needed for meal planning
- ❌ Weekly meal plan entity - 7 daily records sufficient
- ❌ Meal plan templates - Future enhancement
- ❌ Shopping list generation - Future enhancement

### Kept in Scope
- ✅ Simple meals with full nutrition data
- ✅ Daily meal plans with 4 meal slots
- ✅ Weekly generation (7 days)
- ✅ Allergen filtering
- ✅ Fitness goal matching
- ✅ Proper layered architecture
- ✅ Type-safe operations
- ✅ Comprehensive error handling

### Technical Decisions Made
- **LLM Provider**: Zhipu AI with Vercel AI SDK for reliability
- **Architecture**: Clean layered separation with proper error handling
- **Data Model**: Structured agents with specialized business logic
- **Persistence**: Type-safe Kysely repository pattern
- **API Contract**: Clear separation between definitions (`@nora-health/api`) and implementation (`@nora-health/backend`)

## 10. Service & Repository Patterns

### Repository Pattern
- Repository methods return domain model types (not wrapped in Option or custom objects)
- Find operations that may not find a value return `Option.Option<T>`
- Update/delete operations return `Effect.Effect<void>`
- This is by design: repositories interface to the database persistence layer
- Services consume repository methods directly via Effect.flatMap or Effect.pipe

### Service Pattern  
- Services orchestrate business logic and call repository methods
- Services should handle the Option types from repositories appropriately
- Services transform repository errors into service errors
- Services return domain model objects or domain-specific response types

### Why Repository Returns Option<T>

Repositories find/update/delete operations return `Option.Option<T>` to signal:
- **Value not found**: Service can map this to a not-found error or handle gracefully
- **Value found**: Service can unwrap the value and use it

This design allows services to easily distinguish between:
- "This record doesn't exist" (Option.None) vs.
- "Something went wrong during operation" (ServiceError)

### Why Services Use Type Helpers in Method Signatures

When service methods need to work with complex fields (arrays, objects):
- Use `ComplexKeys` union type to identify fields that need special treatment
- Use `ComplexFields` type to define the proper structure for those fields
- In method signatures, exclude from Insertable/Updateable but FORCE inclusion via `& ComplexFields`

Example from HealthProfileService:
```typescript
create(
  payload: Omit<THealthProfile.Insertable, 'id' | ComplexKeys> & ComplexFields
): Effect.Effect<HealthProfile, HealthProfileServiceError>
```

This elegantly:
- Excludes timestamp fields from insert/update operations
- Ensures complex array/object fields are included in their proper types
- Avoids manual field repetition
- Makes the intent of "force-include" explicit

### Using DomainModel.make() in Service Methods

When a service needs to return a domain model object (not just repository result):
- Use `DomainModel.make()` static method if available
- This ensures all required fields are present
- Returns a properly typed domain model instance

Example pattern:
```typescript
return FullUser.make({
  ...user,
  health_profile: healthProfile
})
```

This is especially important when aggregating data from multiple sources.

## 13. Option.match Gotcha

### Understanding the Type Merging Problem

When using `Option.match({ ... })`, both branches (`onSome` and `onNone`) must return types that can be merged. This is a common source of type errors in Effect-TS code.

### How Effect Types Work

An Effect's type is `Effect.Effect<A, E, never>` where:
- `A` = output (success value)
- `E` = error type  
- `R` = requirements (dependencies)

### Option.match Type Compatibility

**✅ Compatible Types (Can be merged):**
```typescript
pipe(
  Option.fromNullable(10),
  Option.match({
    onSome: (num) => Effect.succeed(num), // Effect.Effect<number, never, never>
    onNone: () => Effect.fail(new InvalidDataError()) // Effect.Effect<never, InvalidDataError, never>
  })
) // Effect.Effect<number, InvalidDataError, never>
```

The types merge successfully:
```
  Effect.Effect<number, never, never>
+ Effect.Effect<never, InvalidDataError, never>
-----------------------------------------
  Effect.Effect<number, InvalidDataError, never>
```

**❌ Incompatible Types (Cannot be merged):**
```typescript
pipe(
  Option.fromNullable(10),
  Option.match({
    onSome: (num) => performComputation(num), // Effect.Effect<number, MemoryLimitReachedError | FailedComputationError, never>
    onNone: () => Effect.fail(new InvalidDataError()) // Effect.Effect<never, InvalidDataError, never>
  })
) // Effect.Effect<unknown, unknown, unknown> - TYPE ERROR!
```

The types cannot be merged:
```
  Effect.Effect<number, MemoryLimitReachedError | FailedComputationError, never>
+ Effect.Effect<never, InvalidDataError, never>
-----------------------------------------
  Effect.Effect<unknown, unknown, unknown>
```

### The Solution Pattern

When branches have incompatible types, use `Effect.succeed` for the simple branch to make it mergeable:

```typescript
pipe(
  Option.fromNullable(10),
  Option.match({
    // Don't process the value yet, just succeed with it
    onSome: (num) => Effect.succeed(num), // Effect.Effect<number, never, never>
    onNone: () => Effect.fail(new InvalidDataError()) // Effect.Effect<never, InvalidDataError, never>
  }),
  // Now process the value in a separate step
  Effect.flatMap((num) => performComputation(num)) // Effect.Effect<number, MemoryLimitReachedError | FailedComputationError, never>
) // Effect.Effect<number, MemoryLimitReachedError | FailedComputationError | InvalidDataError, never>
```

### Common Use Cases in This Codebase

**1. Repository Find Operations:**
```typescript
findById: (id) =>
  repository.findById(id).pipe(
    Effect.flatMap(
      Option.match({
        onSome: Effect.succeed, // Just succeed with the found record
        onNone: () => Effect.fail(new MealServiceNotFoundError({}))
      })
    ),
    Effect.flatMap(toDomain), // Process the record in the next step
    Effect.catchTags({
      MealRepositoryError: (error) =>
        new MealServiceError({
          message: error.message,
          cause: error
        })
    })
  )
```

**2. Existence Checks Before Operations:**
```typescript
delete: (id) =>
  repository.findById(id).pipe(
    Effect.flatMap(
      Option.match({
        onSome: () => Effect.succeed(undefined), // Just confirm existence
        onNone: () => Effect.fail(new MealServiceNotFoundError({}))
      })
    ),
    Effect.flatMap(() => repository.delete(id)), // Now perform the operation
    Effect.catchTags({
      MealRepositoryError: (error) =>
        new MealServiceError({
          message: error.message,
          cause: error
        })
    })
  )
```

### Key Takeaways

1. **Always use `Effect.succeed` in Option.match when you need to process the value later**
2. **Keep Option.match simple - just return the value or fail**
3. **Use subsequent Effect.flatMap calls for complex processing**
4. **This pattern ensures proper type inference and avoids `unknown` types**

By following this pattern, you avoid the common pitfall of trying to merge incompatible Effect types in Option.match branches.
