import { Effect } from 'effect'
import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { NotFoundError, UnexpectedError } from '@nora-health/api/common'
import { deletePostUseCase } from '../use-case'
import { DeletePostSuccessResponse } from '@nora-health/api/Post/DeletePostEndpoint'

export const DeletePostEndpointLive = HttpApiBuilder.handler(
  Api,
  'Post',
  'deletePost',
  ({ path }) =>
    Effect.gen(function* () {
      yield* deletePostUseCase(path.id)
      return DeletePostSuccessResponse.make({ id: path.id })
    }).pipe(
      Effect.catchTags({
        PostServiceNotFoundError: () => Effect.fail(new NotFoundError()),
        PostServiceError: (error) =>
          Effect.fail(new UnexpectedError({ message: error.message }))
      })
    )
)
