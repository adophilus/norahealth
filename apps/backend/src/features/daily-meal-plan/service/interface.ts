import type { DailyMealPlan, HealthProfile } from '@nora-health/domain'
import { Context, type Effect } from 'effect'
import type { MealRepository } from '../../meal/repository/interface'
import type { DailyMealPlanRepository } from '../repository/interface'
import type {
  DailyMealPlanServiceError,
  DailyMealPlanServiceNoMealsFoundError
} from './error'

export type WeeklyPlanResult = {
  success: boolean
  dailyPlans: Array<DailyMealPlan>
  message: string
}

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
      WeeklyPlanResult,
      DailyMealPlanServiceError | DailyMealPlanServiceNoMealsFoundError,
      DailyMealPlanRepository | MealRepository
    >
    getWeeklyPlan(
      userId: string,
      weekStartDate: string
    ): Effect.Effect<
      Array<DailyMealPlan>,
      DailyMealPlanServiceError,
      DailyMealPlanRepository
    >
    updateDayPlan(
      userId: string,
      date: string,
      updates: DayPlanUpdate
    ): Effect.Effect<
      DailyMealPlan,
      DailyMealPlanServiceError,
      DailyMealPlanRepository
    >
  }
>() {}
