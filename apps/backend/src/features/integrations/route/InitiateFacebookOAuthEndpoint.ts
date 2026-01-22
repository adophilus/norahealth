import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { CurrentUser, UnexpectedError } from '@nora-health/api/common'
import { InitiateFacebookOAuthSuccessResponse } from '@nora-health/api/Integrations/InitiateFacebookOAuthEndpoint'
import { Effect } from 'effect'
import { initiateFacebookOAuthUseCase } from '../use-case'

const InitiateFacebookOAuthEndpointLive = HttpApiBuilder.handler(
  Api,
  'Integrations',
  'initiateFacebookOAuth',
  () =>
    Effect.gen(function* () {
      const currentUser = yield* CurrentUser
      const result = yield* initiateFacebookOAuthUseCase(currentUser.id)
      return InitiateFacebookOAuthSuccessResponse.make({
        auth_url: result.authUrl
      })
    }).pipe(
      Effect.catchAll((error) =>
        Effect.fail(new UnexpectedError({ message: error.message }))
      )
    )
)

export default InitiateFacebookOAuthEndpointLive
