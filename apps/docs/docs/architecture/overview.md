# NoraHealth Architecture

## Overview

NoraHealth is an AI-powered wellness partner built with TypeScript, organized as a monorepo managed by Nx and pnpm. The system features a multi-agent architecture using `@effect/ai` to provide personalized health guidance, nutrition planning, and workout routines that adapt to user context.

## Project Structure

```
nora-health/
├── apps/
│   ├── backend/         # Node.js/TypeScript backend service with multi-agent system
│   ├── docs/            # VitePress documentation site
│   ├── webapp/          # React web application (dashboard, chat, onboarding)
│   └── website/         # Marketing landing page
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
- Define business entities (User, HealthProfile, Recipe, Workout, etc.)
- Encode business rules and validations
- Provide type-safe domain models for entire system

**Key Models**:
- `User` - User account entity
- `HealthProfile` - User's health constraints (allergies, injuries, goals)
- `Recipe` - Meal recipes with ingredients and nutrition
- `MealPlan` - Daily/weekly meal structures
- `Workout` - Exercise routines
- `WorkoutSession` - Completed workout tracking
- `PantryItem` - User's available ingredients
- `DailyTarget` - Daily goals for meals and workouts
- `ProgressMetric` - User progress tracking
- `AgentConversation` - Agent chat history and context
- `AgentType` - IntakeSafety, MealPlanner, ExerciseCoach, Logistics

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
- `Onboarding` - Health profile creation and updates
- `Meals` - Fridge photo upload, recipe generation, meal plans
- `Workouts` - Workout generation, session completion, weather checks
- `Marketplace` - Ingredient sourcing via Google Maps
- `Agents` - Chat interface and agent hand-offs
- `Progress` - Metrics tracking and visualization
- `Notifications` - Firebase push notification registration

**Endpoint Pattern**:
```typescript
export const SomeEndpoint = HttpApiEndpoint.post(
  'someEndpoint',
  '/path',
).setPayload(RequestSchema)
.addSuccess(ResponseSchema, { status: 200 })
.addError(ErrorSchema, { status: 400 })
```

### 3. Backend Layer (apps/backend)

**Purpose**: Implement API handlers, multi-agent orchestration, and data persistence

**Architecture**: Feature-based with three layers per feature

**Feature Structure**:
```
features/
├── auth/                    # Authentication service
├── user/                    # User profile management
├── storage/                  # File storage
├── llm/                     # LLM service abstraction (Gemini, GLM)
├── agent-orchestration/      # Agent hand-off management
├── intake-safety/            # Onboarding & safety validation
├── meal-planner/            # Vision-powered recipe generation
├── exercise-coach/          # Workout generation & weather adaptation
├── logistics/               # Marketplace & ingredient sourcing
├── wellness/                # Health profile repository
├── meals/                   # Recipe & meal plan repositories
├── workouts/                # Workout & session repositories
├── progress/                # Metrics & tracking repositories
├── firebase/                # Push notification service
├── database/                # Database setup and migrations
└── config/                  # Environment configuration
```

**Layer Responsibilities**:

#### Route Layer
- Implements API endpoint handlers
- Calls service layer for business logic
- Handles HTTP-specific concerns (status codes, headers, multipart forms)
- Maps domain errors to HTTP responses

#### Service Layer
- Orchestrates business operations
- Coordinates multiple repositories
- Implements business rules and workflows
- Integrates with LLM services via @effect/ai
- Returns Effect-based computations

#### Repository Layer
- Data access abstraction
- Kysely-based implementations
- CRUD operations on database tables
- Type-safe queries

**Repository Pattern**:
```typescript
// Interface
export class HealthProfileRepository extends Context.Tag('HealthProfileRepository')<HealthProfileRepository, {
  findByUserId: (userId: string) => Effect.Effect<Option<HealthProfile>, HealthProfileRepositoryError>
  create: (payload: HealthProfile.Insertable) => Effect.Effect<HealthProfile, HealthProfileRepositoryError>
  update: (id: string, payload: HealthProfile.Updateable) => Effect.Effect<HealthProfile, HealthProfileRepositoryError>
}>() {}

// Implementation
export const HealthProfileRepositoryLive = Layer.effect(
  HealthProfileRepository,
  Effect.gen(function* (_) {
    const db = yield* KyselyClient
    return HealthProfileRepository.of({
      findByUserId: (userId) => Effect.tryPromise({
        try: () => db.selectFrom('health_profiles').where('user_id', '=', userId).executeTakeFirst(),
        catch: (error) => new HealthProfileRepositoryError({ message: String(error) })
      }).pipe(Effect.map(Option.fromNullable)),
      // ...
    })
  })
)
```

### 4. Multi-Agent System

**Technology**: @effect/ai and @effect/ai-google

**Architecture**: Specialized agents with clear responsibilities and hand-off orchestration

**Agents**:

#### Intake & Safety Agent
- **Role**: Gatekeeper for onboarding and plan validation
- **Responsibilities**:
  - Conduct empathetic guided onboarding
  - Extract structured health data (allergies, injuries, goals)
  - Cross-reference all plans against medical redlines
  - Trigger health alerts for unsafe recommendations

#### Meal Planner Agent
- **Role**: Nutrition specialist
- **Responsibilities**:
  - Analyze fridge photos via vision (Gemini 2.5 Flash Vision)
  - Generate personalized recipes
  - Create daily/weekly meal plans
  - Respect dietary exclusions from safety agent

#### Exercise Coach Agent
- **Role**: Personal trainer
- **Responsibilities**:
  - Generate adaptive workout routines
  - Check local weather conditions
  - Pivot between indoor/outdoor workouts
  - Adjust intensity based on progress and soreness

#### Logistics Agent
- **Role**: Personal shopper
- **Responsibilities**:
  - Map meal plans to real-world availability
  - Find nearby stores for missing ingredients
  - Provide Google Maps integration

**Orchestration Pattern**:
```typescript
const handleUserMessage = (userId: string, message: string) =>
  Effect.gen(function* () {
    const conversation = yield* getConversation(userId)
    const currentAgent = determineAgent(message, conversation.context)

    // Route to appropriate agent
    const result = yield* match(currentAgent)
      .with('INTAKE_SAFETY', () => intakeSafetyService.handle(message))
      .with('MEAL_PLANNER', () => mealPlannerService.handle(message))
      .with('EXERCISE_COACH', () => exerciseCoachService.handle(message))
      .with('LOGISTICS', () => logisticsService.handle(message))
      .exhaustive()

    // Update conversation context
    yield* updateConversation(userId, result.context)

    return result.response
  })
```

### 5. Database Layer

**Technology**: Kysely (type-safe SQL query builder) with SQLite

**Features**:
- Type-safe database queries based on TypeScript interfaces
- Database migrations via Kysely migrator
- Separate type definitions in `apps/backend/src/types.ts`

**Key Tables**:
- `users` - User accounts with health profile fields
- `auth_tokens` - OTP-based authentication tokens
- `auth_sessions` - User sessions
- `auth_profiles` - Authentication profiles
- `storage_files` - Media file storage
- `health_profiles` - User health constraints and goals
- `recipes` - Meal recipes with nutrition
- `meal_plans` - Daily/weekly meal structures
- `workouts` - Exercise routines
- `workout_sessions` - Completed workout tracking
- `pantry_inventory` - User's available ingredients
- `daily_targets` - Daily goals for meals and workouts
- `progress_metrics` - User progress tracking
- `agent_conversations` - Agent chat history

### 6. LLM Service Layer

**Technology**: @effect/ai and @effect/ai-google

**Purpose**: Abstract LLM access for multi-agent system

**Features**:
- Provider abstraction (Gemini 2.5 Flash, GLM)
- Text chat with JSON output support
- Vision capabilities for image analysis
- Configurable model selection

**LLM Service Interface**:
```typescript
export class LLMService extends Context.Tag('LLMService')<LLMService, {
  chat: (messages: Message[], options?: ChatOptions) => Effect.Effect<TextCompletion, LLMError>
  chatJSON: <T>(messages: Message[], schema: Schema<T>) => Effect.Effect<T, LLMError>
  analyzeImage: (imageBase64: string, prompt: string) => Effect.Effect<ImageAnalysis, LLMError>
}>() {}
```

### 7. API Client Layer (@nora-health/api-client)

**Purpose**: Type-safe, auto-generated TypeScript clients for frontend consumption

**Available Clients**:

1. **`createFetchClient`**:
   - Technology: `openapi-fetch`
   - Use Case: Lightweight, framework-agnostic client for direct API calls

2. **`createTanstackQueryClient`**:
   - Technology: `openapi-react-query`
   - Use Case: React frontends with TanStack Query (recommended for webapp)

3. **`makeApiClient`**:
   - Technology: `@effect/platform/HttpApiClient`
   - Use Case: Effect-native client for other Effect-based services

**Benefits**:
- End-to-end type safety
- No manual API code
- Always in sync with backend

## Effect-based Architecture

**Why Effect**:
- Type-safe error handling
- Composable effects
- Dependency injection via Context.Tag
- Testable and predictable code
- @effect/ai integration for multi-agent workflows

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
  Layer.provide(DatabaseLayer),
  Layer.provide(LLMLayer)
)
```

## Data Flow Examples

### User Onboarding Flow

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

3. Frontend → POST /onboarding/health-profile
   └→ Route handler (CreateHealthProfileEndpointLive)
   └→ Service layer (createHealthProfileUseCase)
      ├→ IntakeSafetyService: Validate health constraints
      ├→ LLMService: Analyze goals for safety
      ├→ HealthProfileRepository: Create health profile
      └→ Return created profile
```

### Fridge-to-Table Flow

```
1. Frontend → POST /meals/upload-fridge-photo (multipart/form-data)
   └→ Route handler (UploadFridgePhotoEndpointLive)
   └→ Service layer (uploadFridgePhotoUseCase)
      ├→ StorageService: Save image file
      ├→ LLMService.analyzeImage: Extract ingredients
      ├→ PantryInventoryRepository: Create pantry items
      └→ Return ingredient list

2. Frontend → POST /meals/recipes/generate
   └→ Route handler (GenerateRecipesEndpointLive)
   └→ Service layer (generateRecipesUseCase)
      ├→ IntakeSafetyService: Get dietary exclusions
      ├→ LLMService.chatJSON: Generate recipes
      └→ RecipeRepository: Save recipes
```

### Morning Workout Adaptation Flow

```
1. Cron Job (7:00 AM) → CheckWeatherJob
   └→ Service layer (checkWeatherForAllUsersUseCase)
      ├→ HealthProfileRepository: Get users with location
      ├→ OpenWeatherAPI: Get weather for each location
      └→ For each user with outdoor workout planned:
         ├→ WorkoutRepository: Get today's workout
         └→ ExerciseCoachService: Adapt workout for weather

2. Weather adaptation logic:
   └→ Service layer (adaptWorkoutForWeatherUseCase)
      ├→ LLMService.chat: Generate indoor alternative
      ├→ WorkoutRepository: Update workout
      └→ FirebaseService: Send push notification
```

## Security Architecture

### Authentication
- OTP-based email authentication (no passwords)
- Short-lived tokens with expiration
- JWT for session management
- HTTP middleware for request authentication

### Data Protection
- Type-safe queries prevent SQL injection (Kysely)
- Encrypted storage for sensitive data (OAuth tokens, Firebase credentials)
- Validation via Effect Schema at runtime
- Safety validation for all AI-generated plans

### Safety Protocol
- All plans cross-referenced against health profile
- Medical redlines trigger automatic blocking
- Health alerts for unsafe recommendations
- User can always override (with acknowledgment)

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
   - Create service with business logic (use @effect/ai for LLM integration)
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
- Minimal tests for happy paths only

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
- LLM integration via @effect/ai

### Agent Pattern
- Specialized agents with clear responsibilities
- Hand-offs via orchestration layer
- Shared conversation context
- LLM-based decision making

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
- Database: SQLite (development and production)
- Server port: Configurable via environment variables

### Key Configuration Files
- `apps/backend/.env.development.example` - Local development
- `apps/backend/.env.staging.example` - Staging
- `apps/backend/.env.production.example` - Production

### Environment Variables

**LLM Configuration**:
- `LLM_PROVIDER` - "gemini" or "glm"
- `GEMINI_API_KEY` - Google AI API key
- `GLM_API_KEY` - Z.AI GLM API key

**External APIs**:
- `OPENWEATHER_API_KEY` - OpenWeather API key
- `GOOGLE_MAPS_API_KEY` - Google Maps API key

**Firebase**:
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_PRIVATE_KEY` - Firebase service account private key
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email

## Summary

NoraHealth is designed with:
- **Type Safety**: TypeScript + Effect Schema throughout
- **Layered Architecture**: Clear separation of concerns
- **Multi-Agent System**: Specialized AI agents with orchestration
- **@effect/ai Integration**: Seamless LLM usage with Effect
- **Monorepo**: Shared code organized in packages
- **Modern Tooling**: Nx, pnpm, Biome, Vitest
- **Database**: Kysely + SQLite for type-safe queries
- **API-first**: Auto-generated client from API definitions
- **Vision-Powered**: Gemini 2.5 Flash Vision for fridge analysis
- **Weather-Adaptive**: Real-time workout adaptation
- **Safety-First**: Health validation at every step

This architecture enables rapid feature development, maintainable code, type safety across frontend and backend, and a sophisticated multi-agent AI system for personalized wellness guidance.
