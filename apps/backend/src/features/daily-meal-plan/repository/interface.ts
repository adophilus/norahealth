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
    ) => Effect.Effect<DailyMealPlan.Selectable, DailyMealPlanRepositoryError>
    findByUserIdAndDateRange: (
      userId: string,
      startDate: string,
      endDate: string
    ) => Effect.Effect<DailyMealPlan.Selectable[], DailyMealPlanRepositoryError>
    updateById: (
      id: string,
      payload: DailyMealPlan.Updateable
    ) => Effect.Effect<
      Option.Option<DailyMealPlan.Selectable>,
      DailyMealPlanRepositoryError
    >
    findByUserId: (
      userId: string
    ) => Effect.Effect<DailyMealPlan.Selectable[], DailyMealPlanRepositoryError>
    deleteById: (
      id: string
    ) => Effect.Effect<
      Option.Option<DailyMealPlan.Selectable>,
      DailyMealPlanRepositoryError
    >
    findByUserIdAndDate: (
      userId: string,
      date: string
    ) => Effect.Effect<
      Option.Option<DailyMealPlan.Selectable>,
      DailyMealPlanRepositoryError
    >
  }
>() {}
