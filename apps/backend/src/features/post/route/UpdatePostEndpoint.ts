import { Effect } from 'effect'
import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { NotFoundError, UnexpectedError } from '@nora-health/api/common'
import { updatePostUseCase } from '../use-case'

export const UpdatePostEndpointLive = HttpApiBuilder.handler(
  Api,
  'Post',
  'updatePost',
  ({ path, payload }) =>
    Effect.gen(function* () {
      const updatePayload = {
        ...payload,
        media_ids: payload.media_ids ? [...payload.media_ids] : undefined
      }
      const post = yield* updatePostUseCase(path.id, updatePayload)
      return post
    }).pipe(
      Effect.catchTags({
        PostServiceNotFoundError: () => Effect.fail(new NotFoundError()),
        PostServiceError: (error) =>
          Effect.fail(new UnexpectedError({ message: error.message }))
      })
    )
)
