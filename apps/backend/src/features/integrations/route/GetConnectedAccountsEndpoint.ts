import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { CurrentUser, UnexpectedError } from '@nora-health/api/common'
import { Effect } from 'effect'
import { getConnectedAccountsUseCase } from '../use-case'

const GetConnectedAccountsEndpointLive = HttpApiBuilder.handler(
  Api,
  'Integrations',
  'getConnectedAccounts',
  () =>
    Effect.gen(function* () {
      const currentUser = yield* CurrentUser
      const result = yield* getConnectedAccountsUseCase(currentUser.id)
      return result
    }).pipe(
      Effect.catchAll((error) =>
        Effect.fail(new UnexpectedError({ message: error.message }))
      )
    )
)

export default GetConnectedAccountsEndpointLive
