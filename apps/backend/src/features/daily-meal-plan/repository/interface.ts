import type { DailyMealPlan } from '@nora-health/domain'
import { Context, type Effect, type Option } from 'effect'
import type { DailyMealPlanRepositoryError } from './error'

export class DailyMealPlanRepository extends Context.Tag(
  'DailyMealPlanRepository'
)<
  DailyMealPlanRepository,
  {
    create: (
      payload: DailyMealPlanInsertable
    ) => Effect.Effect<DailyMealPlan, DailyMealPlanRepositoryError>
    findByUserIdAndDateRange: (
      userId: string,
      startDate: string,
      endDate: string
    ) => Effect.Effect<Array<DailyMealPlan>, DailyMealPlanRepositoryError>
    update: (
      id: string,
      payload: DailyMealPlanUpdatable
    ) => Effect.Effect<DailyMealPlan, DailyMealPlanRepositoryError>
    findByUserId: (
      userId: string
    ) => Effect.Effect<Array<DailyMealPlan>, DailyMealPlanRepositoryError>
    delete: (id: string) => Effect.Effect<void, DailyMealPlanRepositoryError>
    findByUserIdAndDate: (
      userId: string,
      date: string
    ) => Effect.Effect<
      Option.Option<DailyMealPlan>,
      DailyMealPlanRepositoryError
    >
  }
>() {}

export type DailyMealPlanInsertable = Omit<
  DailyMealPlan,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
>

export type DailyMealPlanUpdatable = Partial<
  Pick<
    DailyMealPlan,
    'date' | 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'notes'
  >
>
