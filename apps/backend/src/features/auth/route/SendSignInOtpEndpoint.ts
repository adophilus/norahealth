import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import {
  EmptyMessage,
  TokenNotExpiredError,
  UnexpectedError
} from '@nora-health/api/common/index'
import { Effect } from 'effect'
import { sendSignInOtpUseCase } from '../use-case'

export const SendSignInOtpEndpointLive = HttpApiBuilder.handler(
  Api,
  'Auth',
  'sendSignInOtp',
  ({ payload }) =>
    Effect.gen(function* () {
      yield* sendSignInOtpUseCase(payload)

      return new EmptyMessage()
    }).pipe(
      Effect.mapError((error) => {
        if (error._tag !== 'AuthTokenServiceTokenNotExpiredError') {
          return new UnexpectedError({
            message: error.message
          })
        }

        return error
      }),
      Effect.catchTags({
        AuthTokenServiceTokenNotExpiredError: (error) =>
          Effect.fail(
            new TokenNotExpiredError({
              expires_at: error.expires_at
            })
          )
      })
    )
)
