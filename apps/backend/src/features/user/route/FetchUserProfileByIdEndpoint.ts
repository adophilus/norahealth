import { Effect } from 'effect'
import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { NotFoundError, UnexpectedError } from '@nora-health/api/common'
import { fetchUserProfileByIdUseCase } from '../use-case'

export const FetchUserProfileByIdEndpointLive = HttpApiBuilder.handler(
  Api,
  'User',
  'fetchUserProfileById',
  ({ path }) =>
    Effect.gen(function* () {
      const fullUser = yield* fetchUserProfileByIdUseCase(path.userId)

      return fullUser
    }).pipe(
      Effect.catchTags({
        UserServiceNotFoundError: () => Effect.fail(new NotFoundError()),
        UserServiceError: (error) =>
          Effect.fail(new UnexpectedError({ message: error.message }))
      })
    )
)
