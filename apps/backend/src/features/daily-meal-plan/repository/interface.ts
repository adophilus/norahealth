import type { DailyMealPlan } from '@/types'
import { Context, type Effect, type Option } from 'effect'
import type { DailyMealPlanRepositoryError } from './error'

export class DailyMealPlanRepository extends Context.Tag(
  'DailyMealPlanRepository'
)<
  DailyMealPlanRepository,
  {
    create: (
      payload: DailyMealPlan.Insertable
    ) => Effect.Effect<DailyMealPlan, DailyMealPlanRepositoryError>
    findByUserIdAndDateRange: (
      userId: string,
      startDate: string,
      endDate: string
    ) => Effect.Effect<Array<DailyMealPlan>, DailyMealPlanRepositoryError>
    updateById: (
      id: string,
      payload: DailyMealPlanUpdatable
    ) => Effect.Effect<DailyMealPlan, DailyMealPlanRepositoryError>
    findByUserId: (
      userId: string
    ) => Effect.Effect<Array<DailyMealPlan>, DailyMealPlanRepositoryError>
    deleteById: (
      id: string
    ) => Effect.Effect<void, DailyMealPlanRepositoryError>
    findByUserIdAndDate: (
      userId: string,
      date: string
    ) => Effect.Effect<
      Option.Option<DailyMealPlan>,
      DailyMealPlanRepositoryError
    >
  }
>() {}
