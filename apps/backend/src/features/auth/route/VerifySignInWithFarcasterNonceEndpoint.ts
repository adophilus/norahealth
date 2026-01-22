import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { VerifyAuthSuccessResponse } from '@nora-health/api/Auth/Schemas'
import { UnexpectedError } from '@nora-health/api/common'
import { Effect } from 'effect'
import { verifySignInWithFarcasterNonceUseCase } from '../use-case'

export const VerifySignInWithFarcasterNonceEndpointLive =
  HttpApiBuilder.handler(
    Api,
    'Auth',
    'verifySignInWithFarcasterNonce',
    ({ payload }) =>
      verifySignInWithFarcasterNonceUseCase(payload).pipe(
        Effect.map(({ session, user }) =>
          VerifyAuthSuccessResponse.make({
            access_token: session.id,
            user
          })
        ),
        Effect.mapError((error) => {
          if (error._tag === 'InvalidOrExpiredTokenError') return error

          return new UnexpectedError({ message: error.message })
        })
      )
  )
