import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { GetSignInWithFarcasterUrlSuccessResponse } from '@nora-health/api/Auth/GetSignInWithFarcasterUrlEndpoint'
import { UnexpectedError } from '@nora-health/api/common'
import { Effect } from 'effect'
import { getSignInWithFarcasterUrlUseCase } from '../use-case'

export const GetSignInWithFarcasterUrlEndpointLive = HttpApiBuilder.handler(
  Api,
  'Auth',
  'getSignInWithFarcasterUrl',
  () =>
    getSignInWithFarcasterUrlUseCase().pipe(
      Effect.map((res) => new GetSignInWithFarcasterUrlSuccessResponse(res)),
      Effect.mapError(
        (error) => new UnexpectedError({ message: error.message })
      )
    )
)
