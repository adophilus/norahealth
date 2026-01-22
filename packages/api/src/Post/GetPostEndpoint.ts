import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { Id, Post } from '@nora-health/domain'
import {
  UnauthorizedError,
  BadRequestError,
  UnexpectedError,
  NotFoundError
} from '../common'

export class GetPostRequestParams extends Schema.Class<GetPostRequestParams>(
  'GetPostRequestParams'
)({
  id: Id
}) { }

const GetPostEndpoint = HttpApiEndpoint.get('getPost', '/posts/:id')
  .setPath(GetPostRequestParams)
  .addSuccess(Post, { status: StatusCodes.OK })
  .addError(UnauthorizedError, { status: StatusCodes.UNAUTHORIZED })
  .addError(NotFoundError, { status: StatusCodes.NOT_FOUND })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Get a post by ID')

export default GetPostEndpoint
