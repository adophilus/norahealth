import { HttpApiBuilder } from '@effect/platform'
import {
  Api,
  GenerateWeeklyPlanRequestBody,
  WeeklyPlanResponse
} from '@nora-health/api'
import { CurrentUser, UnexpectedError } from '@nora-health/api/common/index'
import { Effect } from 'effect'
import { DailyMealPlanService } from '../service'

export const GenerateWeeklyPlanEndpointLive = HttpApiBuilder.handler(
  Api,
  'DailyMealPlan',
  'generateWeeklyPlan',
  ({ payload }) =>
    Effect.gen(function* () {
      const currentUser = yield* CurrentUser
      const dailyMealPlanService = yield* DailyMealPlanService

      const weeklyPlanResult = yield* dailyMealPlanService.generateWeeklyPlan(
        payload.start_date,
        currentUser.id
      )

      return new WeeklyPlanResponse({
        daily_plans: weeklyPlanResult.dailyPlans,
        start_date: payload.start_date,
        end_date: weeklyPlanResult.endDate
      })
    }).pipe(
      Effect.mapError(() => {
        return new UnexpectedError({
          message: 'Failed to generate weekly meal plan'
        })
      })
    )
)
