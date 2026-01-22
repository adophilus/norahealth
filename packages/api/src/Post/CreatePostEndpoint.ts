import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { Id, PlatformName, Post } from '@nora-health/domain'
import { UnauthorizedError, BadRequestError, UnexpectedError } from '../common'

export const CreatePostRequestBody = Post.pipe(
  Schema.omit(
    'id',
    'status',
    'published_at',
    'user_id',
    'created_at',
    'updated_at'
  ),
  Schema.extend(
    Schema.Struct({
      platforms: Schema.Array(PlatformName)
    })
  )
)
export type CreatePostRequestBody = typeof CreatePostRequestBody.Type

export class CreatePostSuccessResponse extends Schema.Class<CreatePostSuccessResponse>(
  'CreatePostSuccessResponse'
)({
  id: Id
}) {}

const CreatePostEndpoint = HttpApiEndpoint.post('createPost', '/posts')
  .setPayload(CreatePostRequestBody)
  .addSuccess(CreatePostSuccessResponse, { status: StatusCodes.CREATED })
  .addError(UnauthorizedError, { status: StatusCodes.UNAUTHORIZED })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Create a new post')

export default CreatePostEndpoint
