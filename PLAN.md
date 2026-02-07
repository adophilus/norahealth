# Daily Workout Planner Feature Implementation Plan

## 📋 Overview

This document outlines the implementation plan for the **Daily Workout Planner** feature, which will provide personalized workout recommendations based on user health profiles, similar to the existing Daily Meal Planner feature.

## 🎯 Features

### Core Functionality
- **Workout Management**: CRUD operations for individual workouts with metadata
- **Daily Workout Planning**: Generate personalized 7-day workout plans with 3 nullable slots per day (morning/afternoon/evening)
- **Health-Based Filtering**: Exclude workouts that conflict with user injuries/health conditions
- **Onboarding Integration**: Automatically generate workout plans when users complete onboarding
- **API Access**: Retrieve workout plans for any date range

### Key Architecture Patterns
- Follows the established **Daily Meal Planner** architecture
- Uses **Effect-TS** for type-safe async operations
- **Layered Architecture**: API → Service → Repository → Database
- **Health Profile Integration**: Leverage existing user health data for personalization
- **Soft Delete Pattern**: No data is permanently deleted, only marked as deleted

## 🏗️ Technical Architecture

### Domain Models
- **Workout**: Individual workout entity with body targeting and health metadata
- **DailyWorkoutPlan**: Daily plan with 3 workout slots (morning/afternoon/evening)
- **HealthProfile**: Leverage existing user health data for filtering

### Database Schema
- **workouts**: Store individual workout data with JSON fields for complex arrays
- **daily_workout_plans**: Store daily workout plans with foreign key relationships
- **workout_sessions**: Track workout completion (existing, to be implemented)

### Service Layer
- **WorkoutService**: CRUD operations + health profile-based filtering
- **DailyWorkoutPlanService**: Generate weekly plans + retrieve plans by date range
- **WorkoutRepository**: Database operations for workouts
- **DailyWorkoutPlanRepository**: Database operations for workout plans

### API Layer
- **GET /workout-plan/:start_date/:end_date**: Retrieve workout plans for date range
- **Workout CRUD endpoints**: Basic create/read operations for workouts

## 📊 Implementation Phases

### Phase 1: Domain Models Enhancement (30 min)
**Files**: `packages/domain/src/Workout.ts`, `packages/domain/src/DailyWorkoutPlan.ts`

**Tasks**:
- Enhance `Workout.ts` with body targeting, fitness goals, injury contraindications, intensity
- Create `DailyWorkoutPlan.ts` with 3 nullable workout slots per day

**Key Changes**:
```typescript
// Workout enhancements
export const BodyTarget = Schema.Literal(
  'FULL_BODY', 'UPPER_BODY', 'LOWER_BODY', 'CORE', 'BACK',
  'CHEST', 'SHOULDERS', 'ARMS', 'LEGS', 'CARDIO'
)

export class Workout extends Schema.Class('Workout')({
  // ... existing fields ...
  body_targets: Schema.Array(BodyTarget),
  contraindications: Schema.Array(Injury),
  fitness_goals: Schema.Array(FitnessGoal),
  intensity: Schema.Literal('LOW', 'MODERATE', 'HIGH')
})

// DailyWorkoutPlan structure
export class DailyWorkoutPlan extends Schema.Class('DailyWorkoutPlan')({
  id: Id,
  user_id: Id,
  date: Schema.String,
  morning_workout: Schema.NullOr(Id),
  afternoon_workout: Schema.NullOr(Id),
  evening_workout: Schema.NullOr(Id),
  notes: Schema.String,
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
})
```

### Phase 2: Database Implementation (45 min)
**Files**: Database migrations, type definitions

**Tasks**:
- Fill empty workout migrations (`1769615672558_create_workouts_table.ts`, `1769615681527_create_workout_sessions_table.ts`)
- Create daily_workout_plans migration
- Update database type definitions (`apps/backend/src/features/database/kysely/tables.ts`)
- Add type helpers (`apps/backend/src/types.ts`)

**Database Schema**:
```sql
-- workouts table
CREATE TABLE workouts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('CARDIO', 'STRENGTH', 'FLEXIBILITY', 'HIIT', 'COMPOUND')),
  is_outdoor BOOLEAN NOT NULL,
  exercises TEXT, -- JSON string
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
  duration_minutes INTEGER,
  body_targets TEXT, -- JSON array string
  contraindications TEXT, -- JSON array string
  fitness_goals TEXT, -- JSON array string
  intensity TEXT NOT NULL CHECK (intensity IN ('LOW', 'MODERATE', 'HIGH')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER,
  deleted_at INTEGER
);

-- daily_workout_plans table
CREATE TABLE daily_workout_plans (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  morning_workout_id TEXT,
  afternoon_workout_id TEXT,
  evening_workout_id TEXT,
  notes TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER,
  deleted_at INTEGER,
  FOREIGN KEY (morning_workout_id) REFERENCES workouts(id),
  FOREIGN KEY (afternoon_workout_id) REFERENCES workouts(id),
  FOREIGN KEY (evening_workout_id) REFERENCES workouts(id)
);
```

### Phase 3: Core Workout Service (60 min)
**Files**: `apps/backend/src/features/workout/` (complete directory structure)

**Tasks**:
- Create workout repository interface and implementation
- Create workout service with health profile filtering
- Create workout service error handling
- Implement JSON transformation for complex fields

**Key Features**:
```typescript
export class WorkoutService extends Context.Tag('WorkoutService')<{
  create: (payload: WorkoutData) => Effect.Effect<Workout, WorkoutServiceError>
  findById: (id: string) => Effect.Effect<Option.Option<Workout>, WorkoutServiceError>
  findByHealthProfile: (profile: HealthProfile) => Effect.Effect<Workout[], WorkoutServiceError>
}>()

// Health filtering logic
const findByHealthProfile = (healthProfile) => workouts.filter(workout => 
  !workout.contraindications.some(injury => 
    healthProfile.injuries.includes(injury)
  )
)
```

### Phase 4: Daily Workout Planner Service (45 min)
**Files**: `apps/backend/src/features/workout-plan/` (complete directory structure)

**Tasks**:
- Create workout plan repository (follow meal plan pattern)
- Create workout plan service with weekly plan generation
- Implement workout selection logic based on fitness goals
- Add date-fns utilities for date handling

**Workout Selection Logic**:
```typescript
const selectWorkoutsForDay = (workouts: Workout[], goals: FitnessGoal[]) => ({
  morning_workout: workouts.find(w => w.type === 'CARDIO' && w.intensity === 'MODERATE'),
  afternoon_workout: workouts.find(w => w.type === 'STRENGTH' && w.intensity === 'MODERATE'), 
  evening_workout: workouts.find(w => w.type === 'FLEXIBILITY' && w.intensity === 'LOW')
})
```

### Phase 5: API Layer Implementation (30 min)
**Files**: `packages/api/src/WorkoutPlan/`, `apps/backend/src/features/workout-plan/route/`

**Tasks**:
- Create GetWorkoutPlanEndpoint API definition
- Create workout plan route handler
- Update API index with workout plan group
- Add authentication middleware

**API Endpoint**:
```typescript
const GetWorkoutPlanEndpoint = HttpApiEndpoint.get(
  'getWorkoutPlan',
  '/workout-plan/:start_date/:end_date'
)
  .setPath(GetWorkoutPlanPathParams)
  .addSuccess(Schema.Array(DailyWorkoutPlan), { status: StatusCodes.OK })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
```

### Phase 6: Integration Layer (20 min)
**Files**: `apps/backend/src/features/user/use-case/complete-onboarding.ts`, `apps/backend/src/bootstrap.ts`

**Tasks**:
- Update onboarding use case to generate workout plans
- Add workout services and routes to bootstrap dependency injection
- Ensure proper layer composition

**Onboarding Integration**:
```typescript
export const completeOnboardingUseCase = (payload, user) => Effect.gen(function* () {
  const healthProfileService = yield* HealthProfileService
  const dailyMealPlanService = yield* DailyMealPlanService
  const dailyWorkoutPlanService = yield* DailyWorkoutPlanService  // NEW

  const healthProfile = yield* healthProfileService.create({...})

  yield* dailyMealPlanService.generateWeeklyPlan(user.id, healthProfile)
  yield* dailyWorkoutPlanService.generateWeeklyPlan(user.id, healthProfile)  // NEW
})
```

### Phase 7: Workout Data Seeding (30 min)
**Files**: `apps/backend/scripts/seeders/data/workouts.ts`

**Tasks**:
- Create comprehensive workout seeder data (15-20 workouts)
- Include diverse body targets, fitness goals, injury contraindications
- Add workout seeding to main seeder

**Data Structure**:
```typescript
export const workouts = [
  {
    id: ulid(),
    user_id: 'SYSTEM',
    name: 'Morning Cardio',
    type: 'CARDIO',
    body_targets: JSON.stringify(['CARDIO', 'LOWER_BODY']),
    contraindications: JSON.stringify(['KNEE', 'ANKLE']),
    fitness_goals: JSON.stringify(['WEIGHT_LOSS', 'CARDIO_HEALTH']),
    intensity: 'MODERATE'
    // ... other fields
  }
  // ... 15-20 more diverse workouts
]
```

## 📋 Implementation Todo List

### ✅ Domain Models
- [ ] Enhance `Workout.ts` with body targeting, fitness goals, contraindications, intensity
- [ ] Create `DailyWorkoutPlan.ts` domain model with 3 nullable workout slots

### ✅ Database Schema & Types
- [ ] Fill `1769615672558_create_workouts_table.ts` migration
- [ ] Fill `1769615681527_create_workout_sessions_table.ts` migration
- [ ] Create `daily_workout_plans` migration
- [ ] Update `apps/backend/src/features/database/kysely/tables.ts` with workout types
- [ ] Add Workout and DailyWorkoutPlan type helpers to `apps/backend/src/types.ts`

### ✅ Workout Service Layer
- [ ] Create `apps/backend/src/features/workout/repository/interface.ts`
- [ ] Create `apps/backend/src/features/workout/repository/kysely.ts`
- [ ] Create `apps/backend/src/features/workout/repository/error.ts`
- [ ] Create `apps/backend/src/features/workout/repository/index.ts`
- [ ] Create `apps/backend/src/features/workout/service/interface.ts`
- [ ] Create `apps/backend/src/features/workout/service/live.ts` with health filtering
- [ ] Create `apps/backend/src/features/workout/service/error.ts`
- [ ] Create `apps/backend/src/features/workout/service/index.ts`
- [ ] Implement JSON transformation for complex fields in workout service

### ✅ Workout Plan Service Layer
- [ ] Create `apps/backend/src/features/workout-plan/repository/interface.ts`
- [ ] Create `apps/backend/src/features/workout-plan/repository/kysely.ts`
- [ ] Create `apps/backend/src/features/workout-plan/repository/error.ts`
- [ ] Create `apps/backend/src/features/workout-plan/repository/index.ts`
- [ ] Create `apps/backend/src/features/workout-plan/service/interface.ts`
- [ ] Create `apps/backend/src/features/workout-plan/service/live.ts` with weekly plan generation
- [ ] Create `apps/backend/src/features/workout-plan/service/error.ts`
- [ ] Create `apps/backend/src/features/workout-plan/service/index.ts`
- [ ] Implement `selectWorkoutsForDay` logic based on fitness goals
- [ ] Add date-fns utilities for date handling in plan generation

### ✅ API Layer
- [ ] Create `packages/api/src/WorkoutPlan/GetWorkoutPlanEndpoint.ts`
- [ ] Create `packages/api/src/WorkoutPlan/index.ts` with API group
- [ ] Update main `packages/api/src/Api.ts` to include WorkoutPlanApi
- [ ] Create `apps/backend/src/features/workout-plan/route/GetWorkoutPlanEndpoint.ts`
- [ ] Create `apps/backend/src/features/workout-plan/route/index.ts`
- [ ] Ensure route handler follows established error handling patterns

### ✅ Integration & Bootstrap
- [ ] Update `apps/backend/src/features/user/use-case/complete-onboarding.ts` to include workout plan generation
- [ ] Add WorkoutService and WorkoutRepository imports to `apps/backend/src/bootstrap.ts`
- [ ] Add DailyWorkoutPlanService and DailyWorkoutPlanRepository imports to `apps/backend/src/bootstrap.ts`
- [ ] Create WorkoutServiceLive and WorkoutRepositoryLive layers in bootstrap
- [ ] Create DailyWorkoutPlanServiceLive and DailyWorkoutPlanRepositoryLive layers in bootstrap
- [ ] Add workout services to DepLayer in bootstrap
- [ ] Create DailyWorkoutPlanApiLive route group in bootstrap
- [ ] Add DailyWorkoutPlanApiLive to ApiEndpointLayer in bootstrap

### ✅ Data & Testing
- [ ] Create `apps/backend/scripts/seeders/data/workouts.ts` with 15-20 diverse workouts
- [ ] Include body targets, fitness goals, injury contraindications in workout data
- [ ] Add workout seeding to main seeder (`apps/backend/scripts/seeders/index.ts`)
- [ ] Run database migrations to create new tables
- [ ] Test onboarding flow generates both meal and workout plans
- [ ] Test API endpoint retrieves workout plans correctly
- [ ] Verify health profile filtering excludes unsafe workouts
- [ ] Run final type checking to ensure no errors

## 🎯 Success Criteria

The Daily Workout Planner feature is **complete** when:

1. ✅ **Domain models** are enhanced with body targeting and health metadata
2. ✅ **Database tables** are created and properly typed
3. ✅ **Workout service** provides CRUD operations with health-based filtering
4. ✅ **Daily workout planner service** generates personalized 7-day plans
5. ✅ **API endpoint** retrieves workout plans for any date range
6. ✅ **Onboarding integration** automatically generates workout plans alongside meal plans
7. ✅ **Health profile filtering** safely excludes workouts based on user injuries
8. ✅ **Workout seeder data** provides diverse workout options for demo
9. ✅ **All type checking passes** with no compilation errors
10. ✅ **Integration testing** confirms end-to-end functionality works

## ⚠️ Risks & Mitigations

### Risks
- **Scope creep**: Too many features for hackathon timeline
- **Complex health logic**: Overly sophisticated injury/body targeting logic
- **Database migration conflicts**: Existing schema changes breaking current functionality

### Mitigations
- **Focus on MVP**: Only implement core features needed for demo
- **Simple filtering**: Use basic injury exclusion logic, keep it conservative
- **Additive changes**: New tables and fields won't break existing functionality
- **Follow established patterns**: Leverage daily meal planner architecture

## 📅 Timeline

- **Total Estimated Time**: ~4 hours
- **Phase 1 (Domain)**: 30 min
- **Phase 2 (Database)**: 45 min  
- **Phase 3 (Workout Service)**: 60 min
- **Phase 4 (Workout Plan Service)**: 45 min
- **Phase 5 (API)**: 30 min
- **Phase 6 (Integration)**: 20 min
- **Phase 7 (Data & Testing)**: 30 min

---

**Next Steps**: Review the plan, make any necessary adjustments, then begin implementation following the todo list and success criteria defined above.