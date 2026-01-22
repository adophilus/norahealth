import { Effect } from 'effect'
import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { Message, UnexpectedError, CurrentUser } from '@nora-health/api/common'
import { deleteUserProfileUseCase } from '../use-case'

export const DeleteUserProfileEndpointLive = HttpApiBuilder.handler(
  Api,
  'User',
  'deleteUserProfile',
  () =>
    Effect.gen(function* () {
      const currentUser = yield* CurrentUser

      yield* deleteUserProfileUseCase(currentUser.id)

      return Message.make({ message: 'User profile deleted successfully' })
    }).pipe(
      Effect.catchTags({
        UserServiceNotFoundError: (error) =>
          Effect.fail(new UnexpectedError({ message: error.message })),
        UserServiceError: (error) =>
          Effect.fail(new UnexpectedError({ message: error.message }))
      })
    )
)
