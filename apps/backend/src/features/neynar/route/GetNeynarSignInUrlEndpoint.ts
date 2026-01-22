import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { GetNeynarSignInUrlSuccessResponse } from '@nora-health/api/Neynar/GetNeynarSignInUrlEndpoint'
import { UnexpectedError } from '@nora-health/api/common'
import { Effect } from 'effect'
import { getNeynarSignInUrlUseCase } from '../use-case'

const GetNeynarSignInUrlEndpointLive = HttpApiBuilder.handler(
  Api,
  'Neynar',
  'getNeynarSignInUrl',
  () =>
    getNeynarSignInUrlUseCase().pipe(
      Effect.map((res) => new GetNeynarSignInUrlSuccessResponse(res)),
      Effect.mapError(
        (error) => new UnexpectedError({ message: error.message })
      )
    )
)

export default GetNeynarSignInUrlEndpointLive
