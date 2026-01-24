# Data Model

## Overview

NoraHealth uses a relational database (SQLite) with a normalized schema designed to support the multi-agent wellness system. The data model organizes entities around users, health profiles, meals, workouts, progress, and agent conversations.

## Database Technology

- **Database**: SQLite (development and production)
- **Query Builder**: Kysely (type-safe SQL)
- **Migrations**: Kysely migrator
- **Timestamps**: Unix epoch (integer)

## Entity-Relationship Diagram

```
┌──────────────┐
│     Users     │
└──────┬───────┘
       │ 1
       │
       │ N
┌──────▼─────────────────────────────────────────────┐
│  HealthProfiles                                  │
└──────┬────────────────────────────────────────────┘
       │
       │
       ├─────────────────┬──────────────────┬─────────────┐
       │                 │                  │             │
       │ N               │ N                │ N           │ N
┌──────▼──────┐  ┌──────▼──────┐   ┌──▼──────┐  ┌──▼──────────┐
│    Recipes    │  │   Workouts   │   │PantryItems│  │DailyTargets │
└──────────────┘  └──────────────┘   └──────────┘  └───┬──────────┘
       │                   │                  │              │
       │ N                 │ N                │ N            │ N
┌──────▼──────┐  ┌──────▼──────┐   ┌──▼──────────┐ ┌──▼──────────┐
│  MealPlans   │  │WorkoutSessions│   │ProgressMetrics│└──────────────┘
└──────────────┘  └──────────────┘   └──────────────┘
       │
       │ N
┌──────▼───────────────────────────────────────────┐
│  AgentConversations                             │
└──────────────────────────────────────────────────┘

┌──────────────┐
│StorageFiles  │
│ (Images, etc)│
└──────────────┘
```

## Tables

### users

Core user account table.

| Column | Type | Nullable | Description |
|--------|-------|----------|-------------|
| id | text | NOT NULL | Primary key (ULID) |
| email | text | NULL | User email (nullable) |
| display_name | text | NULL | Display name |
| status | text | NOT NULL | NOT_VERIFIED, VERIFIED, BANNED |
| role | text | NOT NULL | USER, ADMIN |
| profile_picture_id | text | NULL | Reference to storage_files |
| verified_at | integer | NULL | Verification timestamp |
| created_at | integer | NOT NULL | Creation timestamp |
| updated_at | integer | NULL | Last update timestamp |
| deleted_at | integer | NULL | Soft delete timestamp |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE INDEX (email)
- INDEX (status)
- INDEX (created_at)

---

### auth_tokens

OTP-based authentication tokens.

| Column | Type | Nullable | Description |
|--------|-------|----------|-------------|
| id | text | NOT NULL | Primary key (ULID) |
| hash | text | NOT NULL | Token hash |
| provider | text | NOT NULL | Provider type |
| purpose | text | NOT NULL | SIGN_UP_VERIFICATION, SIGN_IN_VERIFICATION |
| expires_at | integer | NOT NULL | Expiration timestamp |
| created_at | integer | NOT NULL | Creation timestamp |
| updated_at | integer | NULL | Last update timestamp |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (hash)
- INDEX (purpose, expires_at)

---

### auth_sessions

User authentication sessions.

| Column | Type | Nullable | Description |
|--------|-------|----------|-------------|
| id | text | NOT NULL | Primary key (ULID) |
| user_id | text | NOT NULL | Reference to users |
| token | text | NOT NULL | Session token (JWT) |
| expires_at | integer | NOT NULL | Expiration timestamp |
| created_at | integer | NOT NULL | Creation timestamp |
| updated_at | integer | NULL | Last update timestamp |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (user_id)
- UNIQUE INDEX (token)
- INDEX (expires_at)

**Foreign Keys**:
- user_id → users.id (ON DELETE CASCADE)

---

### auth_profiles

Additional authentication profile information.

| Column | Type | Nullable | Description |
|--------|-------|----------|-------------|
| id | text | NOT NULL | Primary key (ULID) |
| user_id | text | NOT NULL | Reference to users |
| meta | text | NOT NULL | JSON: { key, value } |
| created_at | integer | NOT NULL | Creation timestamp |
| updated_at | integer | NULL | Last update timestamp |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (user_id)

**Foreign Keys**:
- user_id → users.id (ON DELETE CASCADE)

---

### storage_files

Media file storage.

| Column | Type | Nullable | Description |
|--------|-------|----------|-------------|
| id | text | NOT NULL | Primary key (ULID) |
| original_name | text | NOT NULL | Original filename |
| file_data | blob | NOT NULL | Binary file data |
| mime_type | text | NOT NULL | MIME type (image/jpeg, etc.) |
| user_id | text | NOT NULL | Owner reference |
| created_at | integer | NOT NULL | Creation timestamp |
| updated_at | integer | NULL | Last update timestamp |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (created_at)

**Foreign Keys**:
- user_id → users.id (ON DELETE CASCADE)

---

### health_profiles

User health constraints and goals.

| Column | Type | Nullable | Description |
|--------|-------|----------|-------------|
| id | text | NOT NULL | Primary key (ULID) |
| user_id | text | NOT NULL | Reference to users (UNIQUE) |
| resolution_class | text | NOT NULL | PERFORMANCE, VITALITY, LONGEVITY |
| dietary_exclusions | text | NOT NULL | JSON array: ["DAIRY", "GLUTEN"] |
| physical_constraints | text | NOT NULL | JSON array: ["KNEE", "BACK"] |
| medical_redlines | text | NULL | JSON array: chronic conditions |
| fitness_goals | text | NULL | JSON array: goal descriptions |
| fitness_level | text | NOT NULL | BEGINNER, INTERMEDIATE, ADVANCED |
| created_at | integer | NOT NULL | Creation timestamp |
| updated_at | integer | NULL | Last update timestamp |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE INDEX (user_id)

**Foreign Keys**:
- user_id → users.id (ON DELETE CASCADE)

---

### recipes

Meal recipes.

| Column | Type | Nullable | Description |
|--------|-------|----------|-------------|
| id | text | NOT NULL | Primary key (ULID) |
| user_id | text | NULL | Creator (NULL for AI-generated) |
| name | text | NOT NULL | Recipe name |
| ingredients | text | NOT NULL | JSON array: ingredient names |
| instructions | text | NOT NULL | JSON array: step strings |
| calories | integer | NULL | Total calories |
| protein | integer | NULL | Protein (grams) |
| carbs | integer | NULL | Carbohydrates (grams) |
| fat | integer | NULL | Fat (grams) |
| prep_time_minutes | integer | NULL | Preparation time |
| created_at | integer | NOT NULL | Creation timestamp |
| updated_at | integer | NULL | Last update timestamp |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (created_at)

**Foreign Keys**:
- user_id → users.id (ON DELETE SET NULL)

---

### meal_plans

Daily meal plans.

| Column | Type | Nullable | Description |
|--------|-------|----------|-------------|
| id | text | NOT NULL | Primary key (ULID) |
| user_id | text | NOT NULL | Reference to users |
| date | text | NOT NULL | Date (YYYY-MM-DD) |
| meals | text | NOT NULL | JSON array: recipe IDs [breakfast, lunch, dinner, snack] |
| notes | text | NULL | Plan notes |
| created_at | integer | NOT NULL | Creation timestamp |
| updated_at | integer | NULL | Last update timestamp |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (user_id, date)

**Foreign Keys**:
- user_id → users.id (ON DELETE CASCADE)

---

### workouts

Exercise routines.

| Column | Type | Nullable | Description |
|--------|-------|----------|-------------|
| id | text | NOT NULL | Primary key (ULID) |
| user_id | text | NOT NULL | Reference to users |
| name | text | NOT NULL | Workout name |
| type | text | NOT NULL | CARDIO, STRENGTH, FLEXIBILITY, HIIT, COMPOUND |
| is_outdoor | boolean | NOT NULL | Default: false |
| exercises | text | NOT NULL | JSON array: Exercise objects |
| difficulty_level | text | NOT NULL | BEGINNER, INTERMEDIATE, ADVANCED |
| duration_minutes | integer | NULL | Expected duration |
| created_at | integer | NOT NULL | Creation timestamp |
| updated_at | integer | NULL | Last update timestamp |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (type, is_outdoor)

**Foreign Keys**:
- user_id → users.id (ON DELETE CASCADE)

---

### workout_sessions

Completed workout tracking.

| Column | Type | Nullable | Description |
|--------|-------|----------|-------------|
| id | text | NOT NULL | Primary key (ULID) |
| workout_id | text | NOT NULL | Reference to workouts |
| user_id | text | NOT NULL | Reference to users |
| completed_at | integer | NOT NULL | Completion timestamp |
| soreness_level | text | NULL | NONE, MILD, MODERATE, SEVERE |
| duration_minutes | integer | NULL | Actual duration |
| notes | text | NULL | Session notes |
| created_at | integer | NOT NULL | Creation timestamp |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (workout_id)
- INDEX (user_id, completed_at)

**Foreign Keys**:
- workout_id → workouts.id (ON DELETE CASCADE)
- user_id → users.id (ON DELETE CASCADE)

---

### pantry_inventory

User's available ingredients.

| Column | Type | Nullable | Description |
|--------|-------|----------|-------------|
| id | text | NOT NULL | Primary key (ULID) |
| user_id | text | NOT NULL | Reference to users |
| name | text | NOT NULL | Ingredient name |
| expiry_date | integer | NULL | Expiry timestamp |
| image_url | text | NULL | Reference to storage_files |
| created_at | integer | NOT NULL | Creation timestamp |
| updated_at | integer | NULL | Last update timestamp |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (user_id, name)

**Foreign Keys**:
- user_id → users.id (ON DELETE CASCADE)
- image_url → storage_files.id (ON DELETE SET NULL)

---

### daily_targets

Daily goals for meals and workouts.

| Column | Type | Nullable | Description |
|--------|-------|----------|-------------|
| id | text | NOT NULL | Primary key (ULID) |
| user_id | text | NOT NULL | Reference to users |
| date | text | NOT NULL | Date (YYYY-MM-DD) |
| meal_plan_id | text | NULL | Reference to meal_plans |
| workout_id | text | NULL | Reference to workouts |
| meal_completed | boolean | NOT NULL | Default: false |
| workout_completed | boolean | NOT NULL | Default: false |
| created_at | integer | NOT NULL | Creation timestamp |
| updated_at | integer | NULL | Last update timestamp |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE INDEX (user_id, date)

**Foreign Keys**:
- user_id → users.id (ON DELETE CASCADE)
- meal_plan_id → meal_plans.id (ON DELETE SET NULL)
- workout_id → workouts.id (ON DELETE SET NULL)

---

### progress_metrics

User progress tracking.

| Column | Type | Nullable | Description |
|--------|-------|----------|-------------|
| id | text | NOT NULL | Primary key (ULID) |
| user_id | text | NOT NULL | Reference to users |
| type | text | NOT NULL | WEIGHT, COMPLETION_RATE, STREAK, CALORIES_BURNED, CALORIES_CONSUMED |
| value | text | NOT NULL | Metric value (number or JSON) |
| date | integer | NOT NULL | Metric timestamp |
| created_at | integer | NOT NULL | Creation timestamp |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (user_id, type, date)

**Foreign Keys**:
- user_id → users.id (ON DELETE CASCADE)

---

### agent_conversations

Agent chat history and context.

| Column | Type | Nullable | Description |
|--------|-------|----------|-------------|
| id | text | NOT NULL | Primary key (ULID) |
| user_id | text | NOT NULL | Reference to users |
| agent_type | text | NOT NULL | INTAKE_SAFETY, MEAL_PLANNER, EXERCISE_COACH, LOGISTICS |
| messages | text | NOT NULL | JSON array: Message objects |
| context | text | NULL | JSON object: shared context |
| created_at | integer | NOT NULL | Creation timestamp |
| updated_at | integer | NULL | Last update timestamp |

**Indexes**:
- PRIMARY KEY (id)
- INDEX (user_id, agent_type)
- INDEX (created_at)

**Foreign Keys**:
- user_id → users.id (ON DELETE CASCADE)

---

## JSON Field Structures

### health_profiles.dietary_exclusions
```json
["DAIRY", "GLUTEN", "PEANUTS", "EGGS"]
```

### health_profiles.physical_constraints
```json
[
  {
    "type": "KNEE",
    "description": "Torn ACL from soccer 2020",
    "severity": "MODERATE",
    "modifications": ["no jumping", "limit squats"]
  }
]
```

### recipes.ingredients
```json
["Spinach", "Chicken Breast", "Olive Oil", "Garlic", "Lemon"]
```

### recipes.instructions
```json
[
  "Season chicken with salt, pepper, and olive oil",
  "Grill chicken for 6-7 minutes per side",
  "Sauté spinach with garlic and olive oil until wilted",
  "Serve chicken over spinach with lemon wedges"
]
```

### workouts.exercises
```json
[
  {
    "name": "Push-ups",
    "sets": 3,
    "reps": 15,
    "duration_seconds": null,
    "instructions": "Keep core tight, lower chest to ground",
    "modifications": ["knee push-ups", "wall push-ups"]
  },
  {
    "name": "Plank",
    "sets": 3,
    "reps": null,
    "duration_seconds": 45,
    "instructions": "Hold straight body position",
    "modifications": ["knee plank", "elevated plank"]
  }
]
```

### agent_conversations.messages
```json
[
  {
    "role": "user",
    "content": "I want to build muscle",
    "timestamp": 1706140800
  },
  {
    "role": "assistant",
    "content": "Great! Let me help you with that...",
    "timestamp": 1706140805,
    "agent_type": "INTAKE_SAFETY"
  }
]
```

### agent_conversations.context
```json
{
  "healthProfile": {
    "resolutionClass": "PERFORMANCE",
    "dietaryExclusions": ["DAIRY"],
    "physicalConstraints": ["KNEE"]
  },
  "pantry": {
    "ingredients": ["Eggs", "Spinach"],
    "lastUpdated": 1706140800
  },
  "location": {
    "city": "Lagos",
    "zipCode": "100001",
    "lat": 6.5244,
    "lng": 3.3792
  }
}
```

---

## Key Relationships

### Core User Flow

```
User (1) ────────────────────── HealthProfile (1)
   │                                  │
   ├─────────────┬──────────────────┤
   │             │                  │
   ├─────────▼──┐            ┌───▼──────────┐
   │ PantryItems│            │  Recipes      │
   └─────┬─────┘            └───┬──────────┘
         │                       │
         │               ┌───────▼────────┐
         │               │   MealPlans   │
         │               └───────┬────────┘
         │                       │
         │               ┌───────▼────────┐
         │               │ DailyTargets   │
         │               └────────────────┘
         │
   ┌─────▼─────────┐
   │   Workouts     │
   └─────┬─────────┘
         │
   ┌─────▼──────────┐
   │ WorkoutSessions │
   └─────┬──────────┘
         │
   ┌─────▼──────────┐
   │ProgressMetrics  │
   └────────────────┘
```

---

## Data Integrity

### Cascade Rules

- **users delete**:
  - CASCADE: auth_sessions, health_profiles, storage_files, pantry_inventory, daily_targets, workout_sessions, progress_metrics, agent_conversations
  - SET NULL: recipes, workouts (AI-generated content preserved)

- **workouts delete**:
  - CASCADE: workout_sessions

- **meal_plans delete**:
  - SET NULL: daily_targets (users lose reference, not cascade)

### Soft Deletes

- **users**: Uses `deleted_at` for soft delete (preserves data integrity)
- **auth_tokens**: Expired records can be deleted (purge job)

### Timestamps

- All tables have `created_at` (Unix epoch, integer)
- Most tables have `updated_at` (nullable)
- Foreign tables use expiry timestamps (auth_tokens.expires_at)

---

## Optimization

### Indexes

Critical indexes for performance:
- **users**: (email), (status), (created_at)
- **health_profiles**: (user_id) - UNIQUE
- **daily_targets**: (user_id, date) - UNIQUE
- **meal_plans**: (user_id, date)
- **pantry_inventory**: (user_id, name)
- **progress_metrics**: (user_id, type, date)
- **agent_conversations**: (user_id, agent_type, created_at)

### Query Patterns

Common optimized queries:
```typescript
// Get today's targets (UNIQUE index)
db.selectFrom('daily_targets')
  .where('user_id', '=', userId)
  .where('date', '=', today)
  .executeTakeFirst()

// Get recent pantry items (COMPOUND index)
db.selectFrom('pantry_inventory')
  .where('user_id', '=', userId)
  .where('expiry_date', '>', now)
  .orderBy('expiry_date', 'asc')
  .execute()

// Get health profile (UNIQUE index)
db.selectFrom('health_profiles')
  .where('user_id', '=', userId)
  .executeTakeFirst()

// Get progress metrics (COMPOUND index)
db.selectFrom('progress_metrics')
  .where('user_id', '=', userId)
  .where('type', '=', 'COMPLETION_RATE')
  .where('date', '>', startDate)
  .orderBy('date', 'asc')
  .execute()
```

---

## Data Migration Strategy

### Migrations

- **Naming**: `{timestamp}_{description}.ts`
- **Location**: `apps/backend/migrations/`
- **Tool**: Kysely migrator

### Example Migration

```typescript
import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('health_profiles')
    .addColumn('id', 'text', col => col.primaryKey().notNull())
    .addColumn('user_id', 'text', col => col.notNull())
    .addColumn('resolution_class', 'text', col => col.notNull())
    .addColumn('dietary_exclusions', 'text', col => col.notNull())
    .addColumn('created_at', 'integer', col =>
      col.defaultTo(sql`(UNIXEPOCH())`).notNull()
    )
    .addForeignKeyConstraint(
      'health_profiles_user_id_fkey',
      ['user_id'],
      ['users', 'id'],
      cb => cb.onDelete('cascade')
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('health_profiles').execute()
}
```

---

## Summary

The NoraHealth data model provides:

- **User Management**: Accounts, sessions, authentication
- **Health Profiles**: Structured health data for personalization
- **Nutrition**: Recipes and meal plans with pantry integration
- **Fitness**: Workouts and sessions with progress tracking
- **Progress**: Metrics and daily targets
- **Agent System**: Conversation history and context
- **Storage**: Binary file storage for images/media
- **Normalized Schema**: Minimized redundancy, referential integrity
- **Performance-Optimized**: Strategic indexes, optimized queries
- **Flexible**: JSON columns for structured data (ingredients, exercises)
- **Extensible**: Clear patterns for adding new features

This data model supports the multi-agent system by providing structured access to all user data needed for personalized, context-aware wellness recommendations.
