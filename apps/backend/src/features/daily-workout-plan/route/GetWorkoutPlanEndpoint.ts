import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { CurrentUser, UnexpectedError } from '@nora-health/api/common/index'
import { DailyWorkoutPlan } from '@nora-health/domain'
import { Effect } from 'effect'
import { DailyWorkoutPlanService } from '../service'

const transformToDomainModel = (plans: any[]) => {
  return plans.map((plan) =>
    DailyWorkoutPlan.make({
      id: plan.id,
      user_id: plan.user_id,
      date: plan.date,
      morning_workout: plan.morning_workout_id,
      afternoon_workout: plan.afternoon_workout_id,
      evening_workout: plan.evening_workout_id,
      notes: plan.notes,
      created_at: plan.created_at,
      updated_at: plan.updated_at
    })
  )
}

export const GetWorkoutPlanEndpointLive = HttpApiBuilder.handler(
  Api,
  'WorkoutPlan',
  'getWorkoutPlan',
  ({ path }) =>
    Effect.gen(function* () {
      const currentUser = yield* CurrentUser
      const dailyWorkoutPlanService = yield* DailyWorkoutPlanService

      const plans = yield* dailyWorkoutPlanService.findByUserIdAndDateRange(
        currentUser.id,
        path.start_date,
        path.end_date
      )

      return transformToDomainModel(plans)
    }).pipe(
      Effect.mapError(() => {
        return new UnexpectedError({
          message: 'Failed to get workout plan'
        })
      })
    )
)
