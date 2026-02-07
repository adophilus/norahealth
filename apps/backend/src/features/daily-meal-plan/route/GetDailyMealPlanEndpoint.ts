import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { CurrentUser, UnexpectedError } from '@nora-health/api/common/index'
import { Effect } from 'effect'
import { DailyMealPlanService } from '../service'

export const GetDailyMealPlanEndpointLive = HttpApiBuilder.handler(
  Api,
  'DailyMealPlan',
  'getDailyMealPlan',
  ({ path }) =>
    Effect.gen(function* () {
      const currentUser = yield* CurrentUser
      const dailyMealPlanService = yield* DailyMealPlanService

      const plans = yield* dailyMealPlanService.getPlansWithin(
        currentUser.id,
        path.start_date,
        path.end_date
      )

      return plans
    }).pipe(
      Effect.mapError(() => {
        return new UnexpectedError({
          message: 'Failed to generate weekly meal plan'
        })
      })
    )
)
