import { Effect } from 'effect'
import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { UnexpectedError, CurrentUser } from '@nora-health/api/common'
import { getPostsUseCase } from '../use-case'
import { GetPostsSuccessResponse } from '@nora-health/api/Post/GetPostsEndpoint'

export const GetPostsEndpointLive = HttpApiBuilder.handler(
  Api,
  'Post',
  'getPosts',
  () =>
    Effect.gen(function* () {
      const currentUser = yield* CurrentUser
      const posts = yield* getPostsUseCase(currentUser.id)
      return GetPostsSuccessResponse.make({ posts })
    }).pipe(
      Effect.mapError(
        (error) => new UnexpectedError({ message: error.message })
      )
    )
)
