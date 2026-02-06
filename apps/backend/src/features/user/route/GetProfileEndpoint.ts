import { Effect } from 'effect'
import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { UnexpectedError, CurrentUser } from '@nora-health/api/common'
import { getProfileUseCase } from '../use-case'

export const GetProfileEndpointLive = HttpApiBuilder.handler(
  Api,
  'User',
  'getProfile',
  () =>
    Effect.gen(function* () {
      const currentUser = yield* CurrentUser

      const fullUser = yield* getProfileUseCase(currentUser.id)

      return fullUser
    }).pipe(
      Effect.mapError(
        (error) => new UnexpectedError({ message: error.message })
      )
    )
)
