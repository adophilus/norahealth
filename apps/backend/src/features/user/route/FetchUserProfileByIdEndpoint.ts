import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { NotFoundError, UnexpectedError } from '@nora-health/api/common/index'
import { Effect } from 'effect'
import { fetchUserProfileByIdUseCase } from '../use-case'

export const FetchUserProfileByIdEndpointLive = HttpApiBuilder.handler(
  Api,
  'User',
  'fetchUserProfileById',
  ({ path }) =>
    fetchUserProfileByIdUseCase(path.userId).pipe(
      Effect.catchTags({
        StorageServiceError: (error) =>
          Effect.fail(new UnexpectedError({ message: error.message })),
        UserServiceNotFoundError: () => Effect.fail(new NotFoundError()),
        HealthProfileServiceNotFoundError: () =>
          Effect.fail(new NotFoundError()),
        UserServiceError: (error) =>
          Effect.fail(new UnexpectedError({ message: error.message })),
        HealthProfileServiceError: (error) =>
          Effect.fail(new UnexpectedError({ message: error.message }))
      })
    )
)
