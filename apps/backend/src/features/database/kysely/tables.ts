import type {
  AgentConversation,
  AuthSession,
  AuthToken,
  DailyMealPlan,
  DailyTarget,
  DailyWorkoutPlan,
  HealthProfile,
  Meal,
  PantryItem,
  ProgressMetric,
  StorageFile,
  User,
  Workout,
  WorkoutSession
} from '@nora-health/domain'
import type { ColumnType } from 'kysely'

type Id = ColumnType<string, string, never>

type TimestampModel = {
  created_at: ColumnType<number, never, never>
  updated_at: ColumnType<number | null, never, number>
  deleted_at: ColumnType<number | null, never, number>
}

type WithTimestamp<T> = Omit<T, 'created_at' | 'updated_at' | 'deleted_at'> &
  TimestampModel

type WithImmutableId<T> = Omit<T, 'id'> & {
  id: Id
}

type AuthTokensTable = WithImmutableId<
  WithTimestamp<Omit<AuthToken, 'provider'> & { provider: string }>
>

type AuthSessionsTable = WithImmutableId<WithTimestamp<AuthSession>>

type StorageFilesTable = WithImmutableId<WithTimestamp<StorageFile>>

type HealthProfilesTable = WithImmutableId<
  WithTimestamp<
    Omit<
      HealthProfile,
      | 'injuries'
      | 'medical_conditions'
      | 'fitness_goals'
      | 'allergies'
      | 'location'
    > & {
      injuries: string
      medical_conditions: string
      fitness_goals: string
      allergies: string
      location: string
    }
  >
>

type MealsTable = WithImmutableId<
  WithTimestamp<
    Omit<Meal, 'food_classes' | 'allergens' | 'fitness_goals'> & {
      food_classes: string
      allergens: string
      fitness_goals: string
    }
  >
>

type DailyMealPlansTable = WithImmutableId<
  WithTimestamp<
    Omit<DailyMealPlan, 'snacks'> & {
      snacks: string
    }
  >
>

type DailyWorkoutPlansTable = WithImmutableId<
  WithTimestamp<
    Omit<
      DailyWorkoutPlan,
      'morning_workout' | 'afternoon_workout' | 'evening_workout'
    > & {
      morning_workout_id: ColumnType<string | null, never, string>
      afternoon_workout_id: ColumnType<string | null, never, string>
      evening_workout_id: ColumnType<string | null, never, string>
    }
  >
>

type WorkoutsTable = WithImmutableId<
  WithTimestamp<
    Omit<Workout, 'body_targets' | 'contraindications' | 'fitness_goals'> & {
      body_targets: string
      contraindications: string
      fitness_goals: string
    }
  >
>

type WorkoutSessionsTable = WithImmutableId<WithTimestamp<WorkoutSession>>

type PantryInventoryTable = WithImmutableId<WithTimestamp<PantryItem>>

type DailyTargetsTable = WithImmutableId<WithTimestamp<DailyTarget>>

type ProgressMetricsTable = WithImmutableId<WithTimestamp<ProgressMetric>>

type AgentConversationsTable = WithImmutableId<WithTimestamp<AgentConversation>>

type UsersTable = WithImmutableId<WithTimestamp<User>>

export type KyselyDatabaseTables = {
  users: UsersTable
  auth_tokens: AuthTokensTable
  auth_sessions: AuthSessionsTable
  storage_files: StorageFilesTable
  health_profiles: HealthProfilesTable
  meals: MealsTable
  daily_meal_plans: DailyMealPlansTable
  daily_workout_plans: DailyWorkoutPlansTable
  workouts: WorkoutsTable
  workout_sessions: WorkoutSessionsTable
  pantry_inventory: PantryInventoryTable
  daily_targets: DailyTargetsTable
  progress_metrics: ProgressMetricsTable
  agent_conversations: AgentConversationsTable
}
