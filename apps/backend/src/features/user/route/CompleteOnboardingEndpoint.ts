import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import {
  CurrentUser,
  EmptyMessage,
  UnexpectedError
} from '@nora-health/api/common/index'
import { Effect } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { completeOnboardingUseCase } from '../use-case/complete-onboarding'

export const CompleteOnboardingEndpointLive = HttpApiBuilder.handler(
  Api,
  'User',
  'completeOnboarding',
  ({ payload }) =>
    Effect.gen(function* () {
      const currentUser = yield* CurrentUser

      yield* completeOnboardingUseCase(payload, currentUser)

      return new EmptyMessage()
    }).pipe(
      Effect.mapError(() => {
        return new UnexpectedError({
          message: "Failed to complete user's onboarding"
        })
      })
    )
)

CompleteOnboardingEndpointLive.setSuccessStatus(StatusCodes.NO_CONTENT)
