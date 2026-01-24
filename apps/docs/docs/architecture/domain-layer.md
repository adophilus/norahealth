# Domain Layer

## Overview

The domain layer (@nora-health/domain) contains core business logic, types, and domain models for the entire NoraHealth system. This is the foundation layer that all other packages depend on.

## Purpose

The domain layer serves as the single source of truth for:
- Business entities and their relationships
- Data validation and transformation rules
- Type definitions used across backend and frontend
- Domain-specific error types
- Agent types and conversation models

## Technology Stack

**Effect Schema** is used throughout for:
- Runtime type validation
- Data encoding/decoding
- Schema composition
- Type inference for TypeScript

## Domain Models

### Authentication & User Models

#### User
Represents a user account in the system.
- Fields: id, email, display_name, status, role, profile_picture_id, verified_at, resolution_class, dietary_exclusions, physical_constraints, medical_redlines, location_city, location_zip_code, created_at, updated_at, deleted_at
- Roles: USER, ADMIN
- Status: NOT_VERIFIED, VERIFIED, BANNED

#### AuthSession
Manages user authentication sessions.
- Fields: id, user_id, token, expires_at, created_at
- Links to User for session validation

#### AuthToken
Stores OTP-based authentication tokens.
- Fields: id, email, provider, purpose, otp, expires_at, created_at
- Short-lived tokens for email-based authentication
- Purposes: SIGN_UP_VERIFICATION, SIGN_IN_VERIFICATION

#### AuthProfile
Additional authentication profile information.
- Fields: id, user_id, provider_type, provider_data
- Extends user authentication with third-party providers

### Health Profile Models

#### HealthProfile
Represents a user's health constraints and goals.
- Fields: id, user_id, resolution_class, dietary_exclusions, physical_constraints, medical_redlines, fitness_goals, fitness_level, created_at, updated_at
- Resolution Classes: PERFORMANCE, VITALITY, LONGEVITY
- Fitness Levels: BEGINNER, INTERMEDIATE, ADVANCED

#### ResolutionClass
Enum for user's primary health goal:
- `PERFORMANCE` - Muscle gain, athletic training
- `VITALITY` - Weight loss, metabolic health
- `LONGEVITY` - Mobility, stress management, heart health

#### DietaryExclusion
Enum for common allergens:
- `PEANUTS`
- `DAIRY`
- `GLUTEN`
- `SOY`
- `EGGS`
- `SHELLFISH`
- `TREE_NUTS`
- `FISH`
- `OTHER` (with description field)

#### PhysicalConstraint
Enum for common injury types:
- `KNEE`
- `BACK`
- `SHOULDER`
- `HIP`
- `ANKLE`
- `WRIST`
- `OTHER` (with description field)

### Nutrition Models

#### Recipe
Represents a meal recipe.
- Fields: id, user_id, name, ingredients, instructions, calories, protein, carbs, fat, prep_time_minutes, created_at, updated_at
- Ingredients: JSON array of strings
- Instructions: JSON array of step strings

#### MealPlan
Represents a daily meal plan.
- Fields: id, user_id, date, meals, notes, created_at, updated_at
- Meals: JSON array of recipe IDs
- Date format: YYYY-MM-DD

#### PantryItem
Represents an ingredient in user's pantry.
- Fields: id, user_id, name, expiry_date, image_url, created_at, updated_at
- Links to StorageFile for image

### Fitness Models

#### Workout
Represents an exercise routine.
- Fields: id, user_id, name, type, is_outdoor, exercises, difficulty_level, duration_minutes, created_at, updated_at
- Types: CARDIO, STRENGTH, FLEXIBILITY, HIIT, COMPOUND
- Exercises: JSON array of Exercise objects
- Difficulty Levels: BEGINNER, INTERMEDIATE, ADVANCED

#### Exercise
Component of a workout.
- Fields: name, sets, reps, duration_seconds, instructions, modifications
- Modifications: Array of alternative exercises for injuries

#### WorkoutSession
Represents a completed workout.
- Fields: id, workout_id, user_id, completed_at, soreness_level, duration_minutes, notes, created_at
- Soreness Levels: NONE, MILD, MODERATE, SEVERE

#### FitnessLevel
Enum for user's fitness experience:
- `BEGINNER`
- `INTERMEDIATE`
- `ADVANCED`

### Progress Models

#### DailyTarget
Represents daily goals for meals and workouts.
- Fields: id, user_id, date, meal_plan_id, workout_id, meal_completed, workout_completed, created_at, updated_at
- Date format: YYYY-MM-DD

#### ProgressMetric
Represents tracked metrics over time.
- Fields: id, user_id, type, value, date, created_at
- Types: WEIGHT, COMPLETION_RATE, STREAK, CALORIES_BURNED, CALORIES_CONSUMED
- Value: Can be number or JSON object

### Agent Models

#### AgentType
Enum for specialized AI agents:
- `INTAKE_SAFETY` - Onboarding and safety validation
- `MEAL_PLANNER` - Recipe and meal plan generation
- `EXERCISE_COACH` - Workout generation and adaptation
- `LOGISTICS` - Ingredient sourcing and marketplace

#### AgentConversation
Represents a conversation with an agent.
- Fields: id, user_id, agent_type, messages, context, created_at, updated_at
- Messages: JSON array of Message objects
- Context: JSON object for shared state across agents

#### Message
Represents a message in agent conversation.
- Fields: role (user/assistant/system), content, timestamp, attachments
- Role: USER, ASSISTANT, SYSTEM
- Attachments: Array of file references (images, etc.)

### Weather Models

#### WeatherCondition
Represents local weather data.
- Fields: condition, temperature, humidity, wind_speed, created_at
- Conditions: CLEAR, CLOUDS, RAIN, SNOW, STORM, FOG, WIND
- Temperature: Celsius
- Humidity: Percentage (0-100)
- Wind Speed: km/h

### Storage Models

#### StorageFile
Represents a media file stored in system.
- Fields: id, original_name, file_data, mime_type, user_id, created_at
- Used for fridge photos, workout images, etc.
- Binary data stored in database (SQLite)

## Usage Patterns

### Domain Model Creation

```typescript
import { Schema } from 'effect'
import Id from './Id'

class Recipe extends Schema.Class<Recipe>('Recipe')({
  id: Id,
  user_id: Id,
  name: Schema.String,
  ingredients: Schema.Array(Schema.String),
  instructions: Schema.Array(Schema.String),
  calories: Schema.Number,
  protein: Schema.Number,
  carbs: Schema.Number,
  fat: Schema.Number,
  prep_time_minutes: Schema.Number,
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}

export default Recipe
```

### Schema Validation

```typescript
import { Schema } from 'effect'

const userInput = Schema.decodeUnknown(Recipe)(rawData)
// Returns Effect<Recipe, DecodeError>
```

### Type Export Pattern

```typescript
// packages/domain/src/index.ts
export { default as Recipe } from './Recipe'
export { default as Workout } from './Workout'
export { default as HealthProfile } from './HealthProfile'
// ...
```

## Domain Model Relationships

### User → HealthProfile (One-to-One)
```
User (1) ────────── HealthProfile (1)
```

### User → PantryItem (One-to-Many)
```
User (1) ───────────┐
                   │
                   ├── PantryItem (Eggs)
                   ├── PantryItem (Milk)
                   └── PantryItem (Spinach)
```

### User → Recipe (One-to-Many)
```
User (1) ───────────┐
                   │
                   ├── Recipe (1)
                   ├── Recipe (2)
                   └── Recipe (3)
```

### User → MealPlan (One-to-Many)
```
User (1) ───────────┐
                   │
                   ├── MealPlan (2024-01-15)
                   ├── MealPlan (2024-01-16)
                   └── MealPlan (2024-01-17)
```

### MealPlan → Recipe (Many-to-Many)
```
MealPlan ───────────┐
                   │
                   ├── Recipe (Breakfast)
                   ├── Recipe (Lunch)
                   └── Recipe (Dinner)
```

### User → Workout (One-to-Many)
```
User (1) ───────────┐
                   │
                   ├── Workout (1)
                   ├── Workout (2)
                   └── Workout (3)
```

### Workout → WorkoutSession (One-to-Many)
```
Workout (1) ──────────┐
                     │
                     ├── WorkoutSession (Day 1)
                     ├── WorkoutSession (Day 2)
                     └── WorkoutSession (Day 3)
```

### User → AgentConversation (One-to-Many)
```
User (1) ─────────────────┐
                        │
                        ├── AgentConversation (INTAKE_SAFETY)
                        ├── AgentConversation (MEAL_PLANNER)
                        ├── AgentConversation (EXERCISE_COACH)
                        └── AgentConversation (LOGISTICS)
```

### User → DailyTarget (One-to-Many)
```
User (1) ───────────┐
                   │
                   ├── DailyTarget (2024-01-15)
                   ├── DailyTarget (2024-01-16)
                   └── DailyTarget (2024-01-17)
```

### User → ProgressMetric (One-to-Many)
```
User (1) ───────────┐
                   │
                   ├── ProgressMetric (WEIGHT)
                   ├── ProgressMetric (COMPLETION_RATE)
                   └── ProgressMetric (STREAK)
```

## Supporting Types

#### Id
Unique identifier type (ULID string).

#### Email
Email type with validation.

#### Timestamp
Unix timestamp type.

#### TimestampFromString
Timestamp that can be parsed from string.

#### TimeString
String representation of time.

#### Url
URL type with validation.

#### Pagination
Pagination parameters and metadata.

## Design Principles

1. **Single Responsibility**: Each model represents one business concept
2. **Type Safety**: All models use Effect Schema for runtime validation
3. **Immutability**: Models are immutable by default
4. **Composition**: Complex models composed from simpler ones
5. **Export from index**: Central exports in `index.ts` for clean imports
6. **JSON Arrays for Lists**: Use JSON arrays for multi-value fields (ingredients, exercises, etc.) to simplify database schema

## Migration Guidelines

When modifying domain models:

1. Update model file with new fields
2. Re-export from `index.ts` if it's a new model
3. Create database migration in backend
4. Update types in `apps/backend/src/types.ts`
5. Update API schemas if model used in endpoints
6. Run typecheck: `pnpm typecheck`

## Dependencies

The domain layer has **no external dependencies** besides:
- `effect` (core library)
- All other packages depend on domain layer

This ensures domain logic is pure and can be tested in isolation.

## Agent-Specific Patterns

### LLM Integration
Models that interact with LLMs (Recipe, Workout, etc.) include:
- Validation schemas for LLM output
- JSON serialization methods
- Safety constraint flags

### Safety Validation
HealthProfile model includes:
- `dietary_exclusions` - Array of DietaryExclusion
- `physical_constraints` - Array of PhysicalConstraint
- `medical_redlines` - Array of chronic conditions

These are cross-referenced by:
- Meal Planner Agent (excludes allergens)
- Exercise Coach Agent (modifies for injuries)
- Intake & Safety Agent (validates all plans)

### Context Sharing
AgentConversation model includes:
- `context` - JSON object for shared state
- `messages` - Complete conversation history
- `agent_type` - Current agent handling conversation

This enables hand-offs between agents while maintaining context.

## Summary

The domain layer is the foundation of NoraHealth:
- Defines all business entities (User, HealthProfile, Recipe, Workout, etc.)
- Provides type safety across the system
- Uses Effect Schema for validation
- Organized by feature (Auth, Wellness, Meals, Workouts, Agents)
- Minimal dependencies for maximum portability
- Supports multi-agent system with conversation context
- Enables safety validation across all agents

All other packages (api, backend, api-client) build on top of these domain models.
