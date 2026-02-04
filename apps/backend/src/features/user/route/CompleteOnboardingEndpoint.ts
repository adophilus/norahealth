import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { CurrentUser, UnexpectedError } from '@nora-health/api/common/index'
import { Effect } from 'effect'
import { completeOnboardingUseCase } from '../use-case/complete-onboarding'

export const CompleteOnboardingEndpointLive = HttpApiBuilder.handler(
  Api,
  'User',
  'completeOnboarding',
  ({ payload }) =>
    Effect.gen(function* () {
      const currentUser = yield* CurrentUser

      const result = yield* completeOnboardingUseCase(payload, currentUser)

      return {
        success: true,
        healthProfile: result.healthProfile,
        weeklyMealPlan: result.weeklyMealPlan,
        message: result.mealPlanMessage || 'Onboarding completed successfully!'
      }
    }).pipe(
      Effect.mapError(() => {
        return new UnexpectedError({
          message: "Failed to complete user's onboarding"
        })
      })
    )
)
