import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { Post } from '@nora-health/domain'
import { UnauthorizedError, BadRequestError, UnexpectedError } from '../common'

export class GetPostsSuccessResponse extends Schema.Class<GetPostsSuccessResponse>(
  'GetPostsSuccessResponse'
)({
  posts: Schema.Array(Post)
}) { }

const GetPostsEndpoint = HttpApiEndpoint.get('getPosts', '/posts')
  .addSuccess(GetPostsSuccessResponse, { status: StatusCodes.OK })
  .addError(UnauthorizedError, { status: StatusCodes.UNAUTHORIZED })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Get all posts for a creator')

export default GetPostsEndpoint
