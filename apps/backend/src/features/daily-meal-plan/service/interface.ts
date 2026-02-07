import type { DailyMealPlan, HealthProfile } from '@nora-health/domain'
import { Context, type Effect } from 'effect'
import type {
  DailyMealPlanServiceError,
  DailyMealPlanServiceNoMealsFoundError
} from './error'
import type { DailyMealPlan as TDailyMealPlan } from '@/types'

export type DayPlanUpdate = {
  breakfast: string | null
  lunch: string | null
  dinner: string | null
  snacks: Array<string>
  notes: string
}

export class DailyMealPlanService extends Context.Tag('DailyMealPlanService')<
  DailyMealPlanService,
  {
    generateWeeklyPlan(
      userId: string,
      healthProfile: HealthProfile
    ): Effect.Effect<
      DailyMealPlan[],
      DailyMealPlanServiceError | DailyMealPlanServiceNoMealsFoundError,
      never
    >
    getWeeklyPlan(
      userId: string,
      weekStartDate: string
    ): Effect.Effect<Array<DailyMealPlan>, DailyMealPlanServiceError, never>
    updateDayPlan(
      userId: string,
      date: string,
      updates: Omit<
        TDailyMealPlan.Updateable,
        'user_id' | 'updated_at' | 'deleted_at' | 'date' | 'snacks'
      > & { snacks: string[] }
    ): Effect.Effect<DailyMealPlan, DailyMealPlanServiceError, never>
  }
>() {}
