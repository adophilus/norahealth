import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { GetSignInWithFarcasterNonceSuccessResponse } from '@nora-health/api/Auth/GetSignInWithFarcasterNonceEndpoint'
import { UnexpectedError } from '@nora-health/api/common'
import { Effect } from 'effect'
import { getSignInWithFarcasterNonceUseCase } from '../use-case'

export const GetSignInWithFarcasterNonceEndpointLive = HttpApiBuilder.handler(
  Api,
  'Auth',
  'getSignInWithFarcasterNonce',
  () =>
    getSignInWithFarcasterNonceUseCase().pipe(
      Effect.map(
        (nonce) => new GetSignInWithFarcasterNonceSuccessResponse({ nonce })
      ),
      Effect.mapError(
        (error) => new UnexpectedError({ message: error.message })
      )
    )
)
