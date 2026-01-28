import type {
  AgentConversation,
  AuthProfile,
  AuthSession,
  AuthToken,
  DailyTarget,
  HealthProfile,
  MealPlan,
  PantryItem,
  ProgressMetric,
  Recipe,
  StorageFile,
  User,
  Workout,
  WorkoutSession
} from '@nora-health/domain'
import type { ColumnType } from 'kysely'

type Id = ColumnType<string, never, never>

type TimestampModel = {
  created_at: ColumnType<number, never, never>
  updated_at: ColumnType<number | null, never, number>
}

type WithTimestamp<T> = Omit<T, 'created_at' | 'updated_at'> & TimestampModel

type WithImmutableId<T> = Omit<T, 'id'> & { id: Id }

type AuthTokensTable = WithImmutableId<
  WithTimestamp<Omit<AuthToken, 'provider'> & { provider: string }>
>

type AuthSessionsTable = WithImmutableId<WithTimestamp<AuthSession>>

type AuthProfilesTable = WithImmutableId<
  WithTimestamp<Omit<AuthProfile, 'meta'> & { meta: string }>
>

type StorageFilesTable = WithImmutableId<WithTimestamp<StorageFile>>

type HealthProfilesTable = WithImmutableId<WithTimestamp<HealthProfile>>

type RecipesTable = WithImmutableId<WithTimestamp<Recipe>>

type MealPlansTable = WithImmutableId<WithTimestamp<MealPlan>>

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
  recipes: RecipesTable
  meal_plans: MealPlansTable
  workouts: WorkoutsTable
  workout_sessions: WorkoutSessionsTable
  pantry_inventory: PantryInventoryTable
  daily_targets: DailyTargetsTable
  progress_metrics: ProgressMetricsTable
  agent_conversations: AgentConversationsTable
}
