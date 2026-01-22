import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { GetNeynarSignInNonceSuccessResponse } from '@nora-health/api/Neynar/GetNeynarSignInNonceEndpoint'
import { UnexpectedError } from '@nora-health/api/common'
import { Effect } from 'effect'
import { getNeynarSignInNonceUseCase } from '../use-case'

const GetNeynarSignInNonceEndpointLive = HttpApiBuilder.handler(
  Api,
  'Neynar',
  'getNeynarSignInNonce',
  () =>
    getNeynarSignInNonceUseCase().pipe(
      Effect.map((nonce) => new GetNeynarSignInNonceSuccessResponse({ nonce })),
      Effect.mapError(
        (error) => new UnexpectedError({ message: error.message })
      )
    )
)

export default GetNeynarSignInNonceEndpointLive
