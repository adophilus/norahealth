import { Effect } from 'effect'
import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { Message, UnexpectedError, CurrentUser } from '@nora-health/api/common'
import { updateUserProfileUseCase } from '../use-case'

export const UpdateUserProfileEndpointLive = HttpApiBuilder.handler(
  Api,
  'User',
  'updateUserProfile',
  ({ payload }) =>
    Effect.gen(function* () {
      const currentUser = yield* CurrentUser

      yield* updateUserProfileUseCase(currentUser.id, payload)

      return Message.make({ message: 'User profile updated successfully' })
    }).pipe(
      Effect.catchTags({
        UserServiceNotFoundError: () =>
          new UnexpectedError({ message: 'User not found' }),
        UserServiceError: (error) =>
          new UnexpectedError({ message: error.message })
      })
    )
)
