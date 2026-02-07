import type {
  AgentConversation,
  AuthSession,
  AuthToken,
  DailyMealPlan,
  DailyTarget,
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
}

type WithTimestamp<T> = Omit<T, 'created_at' | 'updated_at'> & TimestampModel

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

type WorkoutsTable = WithImmutableId<WithTimestamp<Workout>>

type WorkoutSessionsTable = WithImmutableId<WorkoutSession>

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
  workouts: WorkoutsTable
  workout_sessions: WorkoutSessionsTable
  pantry_inventory: PantryInventoryTable
  daily_targets: DailyTargetsTable
  progress_metrics: ProgressMetricsTable
  agent_conversations: AgentConversationsTable
}
