import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { UnexpectedError } from '@nora-health/api/common'
import { FacebookOAuthCallbackSuccessResponse } from '@nora-health/api/Integrations/FacebookOAuthCallbackEndpoint'
import { Effect } from 'effect'
import { facebookOAuthCallbackUseCase } from '../use-case'

const FacebookOAuthCallbackEndpointLive = HttpApiBuilder.handler(
  Api,
  'Integrations',
  'facebookOAuthCallback',
  ({ payload }) =>
    Effect.gen(function* () {
      const result = yield* facebookOAuthCallbackUseCase(
        payload.code,
        payload.state
      )
      return FacebookOAuthCallbackSuccessResponse.make({ success: true })
    }).pipe(
      Effect.catchAll((error) =>
        Effect.fail(new UnexpectedError({ message: error.message }))
      )
    )
)

export default FacebookOAuthCallbackEndpointLive
