import { Effect } from 'effect'
import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { NotFoundError, UnexpectedError } from '@nora-health/api/common'
import { getPostUseCase } from '../use-case'

export const GetPostEndpointLive = HttpApiBuilder.handler(
  Api,
  'Post',
  'getPost',
  ({ path }) =>
    Effect.gen(function* () {
      const post = yield* getPostUseCase(path.id)
      return post
    }).pipe(
      Effect.mapError((error) =>
        error._tag === 'PostServiceNotFoundError'
          ? new NotFoundError()
          : new UnexpectedError({ message: error.message })
      )
    )
)
