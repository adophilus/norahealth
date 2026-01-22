import { Effect } from 'effect'
import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { CreatePostSuccessResponse } from '@nora-health/api/Post/CreatePostEndpoint'
import { UnexpectedError, CurrentUser } from '@nora-health/api/common'
import { createPostUseCase } from '../use-case'

export const CreatePostEndpointLive = HttpApiBuilder.handler(
  Api,
  'Post',
  'createPost',
  ({ payload }) =>
    Effect.gen(function* () {
      const currentUser = yield* CurrentUser

      const post = yield* createPostUseCase(payload, currentUser)

      return CreatePostSuccessResponse.make({
        id: post.id
      })
    }).pipe(
      Effect.mapError(
        (error) => new UnexpectedError({ message: error.message })
      )
    )
)
