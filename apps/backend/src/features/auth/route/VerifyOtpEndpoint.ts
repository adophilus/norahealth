import { Effect } from 'effect'
import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import {
  InvalidOrExpiredTokenError,
  UnexpectedError
} from '@nora-health/api/common/index'
import { verifyOtpUseCase } from '../use-case'
import { VerifyAuthSuccessResponse } from '@nora-health/api/Auth/Schemas'

export const VerifyOtpEndpointLive = HttpApiBuilder.handler(
  Api,
  'Auth',
  'verifyOtp',
  ({ payload }) =>
    Effect.gen(function* () {
      const { session, user } = yield* verifyOtpUseCase(payload)

      return VerifyAuthSuccessResponse.make({
        access_token: session.id,
        user
      })
    }).pipe(
      Effect.catchTags({
        UserServiceNotFoundError: (error) =>
          Effect.fail(
            new InvalidOrExpiredTokenError({ message: error.message })
          ),
        UserServiceError: (error) =>
          Effect.fail(
            new UnexpectedError({
              message: `Failed to verify: ${error.message}`
            })
          ),
        AuthTokenServiceError: (error) =>
          Effect.fail(
            new UnexpectedError({
              message: `Failed to verify: ${error.message}`
            })
          ),
        AuthTokenServiceInvalidTokenError: (error) =>
          Effect.fail(
            new InvalidOrExpiredTokenError({ message: error.message })
          ),
        AuthTokenServiceTokenExpiredError: (error) =>
          Effect.fail(
            new InvalidOrExpiredTokenError({ message: error.message })
          ),
        AuthSessionServiceError: (error) =>
          Effect.fail(
            new UnexpectedError({
              message: `Failed to create session: ${error.message}`
            })
          )
      })
    )
)
