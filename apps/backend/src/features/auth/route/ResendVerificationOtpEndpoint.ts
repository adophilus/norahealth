import { Effect } from 'effect'
import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { ResendVerificationOtpSuccessResponse } from '@nora-health/api/Auth/ResendVerificationOtpEndpoint'
import { UserNotFoundError, UnexpectedError } from '@nora-health/api/common/index'
import { VerificationOtpAlreadySentError } from '@nora-health/api/common'
import { resendVerificationOtpUseCase } from '../use-case'

export const ResendVerificationOtpEndpointLive = HttpApiBuilder.handler(
  Api,
  'Auth',
  'resendVerificationOtp',
  ({ payload }) =>
    Effect.gen(function* () {
      yield* resendVerificationOtpUseCase(payload)

      return ResendVerificationOtpSuccessResponse.make()
    }).pipe(
      Effect.catchTags({
        UserRepositoryError: (error) =>
          Effect.fail(
            new UnexpectedError({
              message: error.message
            })
          ),
        AuthTokenServiceError: (error) =>
          Effect.fail(
            new UnexpectedError({
              message: error.message
            })
          ),
        AuthTokenServiceTokenNotExpiredError: (error) =>
          Effect.fail(
            new VerificationOtpAlreadySentError({
              expires_at: error.expires_at
            })
          ),
        UserNotFoundError: () => Effect.fail(new UserNotFoundError())
      })
    )
)
