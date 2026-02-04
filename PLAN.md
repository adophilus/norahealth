# Meal Planner Repo & Service Implementation Plan

## Executive Summary

**Current State**:
- ✅ Meal Repository: Fully implemented and working
- ✅ DailyMealPlan Repository: Fully implemented and working
- ⚠️ DailyMealPlan Service: Has 2 critical bugs
- ❌ Meal Service: Missing entirely
- ⚠️ Domain Exports: Inconsistent export/import patterns
- ❌ MealPlan Model: Deprecated but still referenced

**Goal**: Fix bugs, create missing service layer, remove deprecated code

---

## Phase 1: Fix Critical Bugs (BLOCKERS)

### Bug 1: DailyMealPlanService Error Syntax Errors
**File**: `/apps/backend/src/features/daily-meal-plan/service/error.ts`

**Issue**: Lines 10 and 14 missing `{}` after error class declarations

**Fix**:
```typescript
export class DailyMealPlanServiceError extends Data.TaggedError(
  'DailyMealPlanServiceError'
)<{
  message: string
  cause?: unknown
}> {}
```

### Bug 2: DailyMealPlanService Type Error
**File**: `/apps/backend/src/features/daily-meal-plan/service/live.ts`

**Issue**: Lines 109-151 `selectMealsForDay` function has wrong parameter type

**Fix**:
```typescript
import type { Meal } from '@nora-health/domain'

const selectMealsForDay = (
  availableMeals: Meal[],
  fitnessGoals: FitnessGoal[]
) => {
  // ... function implementation
}
```

---

## Phase 2: Fix Domain Exports (CONSISTENCY)

### Issue: Inconsistent Export Patterns

**Fix Option A (Recommended)**: Change to default exports in domain files

**Files to modify**:
1. `/packages/domain/src/Meal.ts` - Change `export class` to `export default class`
2. `/packages/domain/src/DailyMealPlan.ts` - Change `export class` to `export default class`
3. Keep `/packages/domain/src/index.ts` as-is (already expects default exports)

---

## Phase 3: Remove Deprecated MealPlan (CLEANUP)

### 3.1 Delete MealPlan Domain Model
**File**: `/packages/domain/src/MealPlan.ts`
**Action**: Delete entire file

### 3.2 Remove MealPlan from Domain Exports
**File**: `/packages/domain/src/index.ts`
**Line 11**: Remove `export { default as MealPlan } from './MealPlan'`

### 3.3 Remove MealPlan from Database Types
**File**: `/apps/backend/src/features/database/kysely/tables.ts`

**Line 9**: Remove import of MealPlan
**Line 68**: Remove MealPlansTable definition
**Line 92**: Remove recipes: RecipesTable reference
**Line 94**: Remove meal_plans from KyselyDatabaseTables

---

## Phase 4: Create Missing Meal Service Layer (IMPLEMENTATION)

### 4.1 Create Meal Service Directory Structure
```
/apps/backend/src/features/meal/service/
├── interface.ts    # Service interface definition
├── error.ts       # Error classes
├── live.ts        # Live implementation
└── index.ts       # Barrel export
```

### 4.2 Create Meal Service Interface
**File**: `/apps/backend/src/features/meal/service/interface.ts`

### 4.3 Create Meal Service Errors
**File**: `/apps/backend/src/features/meal/service/error.ts`

**Error Classes**:
- `MealServiceError` - Generic service errors with message
- `MealServiceNotFoundError` - Self-explanatory (no message)
- `MealServiceValidationError` - Validation errors with field name

### 4.4 Create Meal Service Implementation
**File**: `/apps/backend/src/features/meal/service/live.ts`

**Features**:
- CRUD operations with input validation
- Query operations wrapping repository
- Business logic for nutrition aggregation
- Proper error handling and transformation

### 4.5 Create Meal Service Index
**File**: `/apps/backend/src/features/meal/service/index.ts`

---

## Phase 5: Testing & Validation (QUALITY)

### 5.1 Run Typecheck
```bash
pnpm typecheck
```

### 5.2 Run Linter
```bash
pnpm lint
```

### 5.3 Run Tests
```bash
pnpm test
```

### 5.4 Manual Testing
1. Seed meals (if not already done)
2. Generate weekly meal plan via onboarding
3. Verify 7 daily plans are created
4. Check meal selections match fitness goals and exclude allergens

---

## Summary of Changes

### Files to Modify (7 files)
1. `/apps/backend/src/features/daily-meal-plan/service/error.ts` - Fix syntax
2. `/apps/backend/src/features/daily-meal-plan/service/live.ts` - Fix type bug
3. `/packages/domain/src/Meal.ts` - Change to default export
4. `/packages/domain/src/DailyMealPlan.ts` - Change to default export
5. `/packages/domain/src/index.ts` - Remove MealPlan export
6. `/apps/backend/src/features/database/kysely/tables.ts` - Remove MealPlan, RecipesTable

### Files to Create (4 files)
1. `/apps/backend/src/features/meal/service/interface.ts`
2. `/apps/backend/src/features/meal/service/error.ts`
3. `/apps/backend/src/features/meal/service/live.ts`
4. `/apps/backend/src/features/meal/service/index.ts`

### Files to Delete (1 file)
1. `/packages/domain/src/MealPlan.ts`

---

## Success Criteria

### Phase 1-2 Completion
- [ ] No syntax errors in DailyMealPlanService
- [ ] No type errors in DailyMealPlanService
- [ ] Domain exports are consistent
- [ ] Typecheck passes for entire monorepo

### Phase 3 Completion
- [ ] MealPlan domain model deleted
- [ ] No references to MealPlan in codebase
- [ ] No RecipesTable references in types

### Phase 4 Completion
- [ ] Meal service layer created
- [ ] All repository methods wrapped with business logic
- [ ] Nutrition aggregation implemented
- [ ] Input validation added

### Phase 5 Completion
- [ ] Typecheck passes
- [ ] Linter passes
- [ ] Tests pass
- [ ] Manual testing confirms weekly meal plan generation works

---

## Decisions Made

### 1. Meal Service Scope
**Decision**: Option B - Basic validation
**Rationale**: Follow codebase patterns, ensures data quality without over-engineering

### 2. Nutrition Summary
**Decision**: Implement `getMealNutritionSummary` method
**Rationale**: Simple and valuable for daily meal plan nutrition tracking

### 3. Service Layer Pattern
**Decision**: Option B - Input validation before repository call
**Rationale**: Ensures data quality and follows established patterns

### 4. Error Handling
**Decision**: Option A - Minimal errors
**Rationale**: Consistent with codebase error handling guidelines

---

## Architecture Overview

### Current Domain Models

**Meal**:
- Individual meal items with nutrition data
- Food classes, allergens, fitness goals
- Preparation time, cover images

**DailyMealPlan**:
- Single day's meal assignments
- Links to meals (breakfast, lunch, dinner, snacks)
- User association, notes

### Database Structure

**meals table**:
- id, name, description
- food_classes (JSON array)
- calories, protein, carbs, fat
- prep_time_minutes, cover_image_id
- allergens (JSON array)
- is_prepackaged, fitness_goals (JSON array)
- timestamps, soft delete

**daily_meal_plans table**:
- id, user_id, date
- breakfast, lunch, dinner (FK → meals.id)
- snacks (JSON array of meal IDs)
- notes, timestamps, soft delete

### Relationships

```
users (1) ────< (N) daily_meal_plans
                       │
                       ├── (1) ────< (1) meals (breakfast)
                       ├── (1) ────< (1) meals (lunch)
                       ├── (1) ────< (1) meals (dinner)
                       └── (N) ────< (N) meals (snacks)
```

---

## Implementation Decisions

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
