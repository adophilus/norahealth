import { Effect } from 'effect'
import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { GetProfileSuccessResponse } from '@nora-health/api/User/GetProfileEndpoint'
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

      return GetProfileSuccessResponse.make({
        data: fullUser
      })
    }).pipe(
      Effect.catchTags({
        UserServiceNotFoundError: (error) =>
          Effect.fail(new UnexpectedError({ message: error.message })),
        UserServiceError: (error) =>
          Effect.fail(new UnexpectedError({ message: error.message })),
        StorageServiceError: (error) =>
          Effect.fail(new UnexpectedError({ message: error.message }))
      })
    )
)
