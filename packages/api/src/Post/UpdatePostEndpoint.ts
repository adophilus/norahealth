import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { Id } from '@nora-health/domain'
import {
  UnauthorizedError,
  BadRequestError,
  UnexpectedError,
  NotFoundError,
  EmptyMessage
} from '../common'
import { CreatePostRequestBody } from './CreatePostEndpoint'

export class UpdatePostRequestParams extends Schema.Class<UpdatePostRequestParams>(
  'UpdatePostRequestParams'
)({
  id: Id
}) { }

export class UpdatePostRequestBody extends CreatePostRequestBody.pipe(
  Schema.partial
) { }

const UpdatePostEndpoint = HttpApiEndpoint.patch('updatePost', '/posts/:id')
  .setPath(UpdatePostRequestParams)
  .setPayload(UpdatePostRequestBody)
  .addSuccess(EmptyMessage, { status: StatusCodes.OK })
  .addError(UnauthorizedError, { status: StatusCodes.UNAUTHORIZED })
  .addError(NotFoundError, { status: StatusCodes.NOT_FOUND })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Update a post')

export default UpdatePostEndpoint
