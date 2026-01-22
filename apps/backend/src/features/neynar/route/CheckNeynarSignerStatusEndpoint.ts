import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { UnexpectedError } from '@nora-health/api/common'
import { Effect } from 'effect'
import { checkNeynarSignerStatusUseCase } from '../use-case'
import { CheckNeynarSignerStatusSuccessResponse } from '@nora-health/api/Neynar/CheckNeynarSignerStatusEndpoint'

const CheckNeynarSignerStatusEndpointLive = HttpApiBuilder.handler(
  Api,
  'Neynar',
  'checkNeynarSignerStatus',
  ({ path }) =>
    Effect.gen(function* () {
      const result = yield* checkNeynarSignerStatusUseCase(path.id)

      return CheckNeynarSignerStatusSuccessResponse.make({
        status: result.status
      })
    }).pipe(
      Effect.catchAll((error) =>
        Effect.fail(new UnexpectedError({ message: error.message }))
      )
    )
)

export default CheckNeynarSignerStatusEndpointLive
