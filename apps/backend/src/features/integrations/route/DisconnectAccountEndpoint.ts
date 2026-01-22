import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { UnexpectedError } from '@nora-health/api/common'
import { DisconnectAccountSuccessResponse } from '@nora-health/api/Integrations/DisconnectAccountEndpoint'
import { Effect } from 'effect'
import { disconnectAccountUseCase } from '../use-case'

const DisconnectAccountEndpointLive = HttpApiBuilder.handler(
  Api,
  'Integrations',
  'disconnectAccount',
  ({ payload }) =>
    Effect.gen(function* () {
      yield* disconnectAccountUseCase(payload.account_id)
      return DisconnectAccountSuccessResponse.make({ success: true })
    }).pipe(
      Effect.catchAll((error) =>
        Effect.fail(new UnexpectedError({ message: error.message }))
      )
    )
)

export default DisconnectAccountEndpointLive
