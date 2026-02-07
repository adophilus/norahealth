import { Context, type Effect, type Option } from 'effect'
import type { DailyWorkoutPlan } from '@/types'
import type { DailyWorkoutPlanRepositoryError } from './error'

export class DailyWorkoutPlanRepository extends Context.Tag(
  'DailyWorkoutPlanRepository'
)<
  DailyWorkoutPlanRepository,
  {
    create(
      payload: DailyWorkoutPlan.Insertable
    ): Effect.Effect<
      DailyWorkoutPlan.Selectable,
      DailyWorkoutPlanRepositoryError
    >
    update(
      id: string,
      payload: DailyWorkoutPlan.Updateable
    ): Effect.Effect<
      Option.Option<DailyWorkoutPlan.Selectable>,
      DailyWorkoutPlanRepositoryError
    >
    delete(
      id: string
    ): Effect.Effect<
      Option.Option<DailyWorkoutPlan.Selectable>,
      DailyWorkoutPlanRepositoryError
    >
    findByUserId(
      userId: string
    ): Effect.Effect<
      DailyWorkoutPlan.Selectable[],
      DailyWorkoutPlanRepositoryError
    >
    findByUserIdAndDate(
      userId: string,
      date: string
    ): Effect.Effect<
      Option.Option<DailyWorkoutPlan.Selectable>,
      DailyWorkoutPlanRepositoryError
    >
    findByUserIdAndDateRange(
      userId: string,
      startDate: string,
      endDate: string
    ): Effect.Effect<
      DailyWorkoutPlan.Selectable[],
      DailyWorkoutPlanRepositoryError
    >
    findAll(): Effect.Effect<
      DailyWorkoutPlan.Selectable[],
      DailyWorkoutPlanRepositoryError
    >
    findById(
      id: string
    ): Effect.Effect<
      Option.Option<DailyWorkoutPlan.Selectable>,
      DailyWorkoutPlanRepositoryError
    >
  }
>() {}
