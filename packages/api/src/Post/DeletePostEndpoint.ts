import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { Id } from '@nora-health/domain'
import {
  UnauthorizedError,
  BadRequestError,
  UnexpectedError,
  NotFoundError
} from '../common'

export class DeletePostRequestParams extends Schema.Class<DeletePostRequestParams>(
  'DeletePostRequestParams'
)({
  id: Id
}) {}

export class DeletePostSuccessResponse extends Schema.Class<DeletePostSuccessResponse>(
  'DeletePostSuccessResponse'
)({
  id: Id
}) {}

const DeletePostEndpoint = HttpApiEndpoint.del('deletePost', '/posts/:id')
  .setPath(DeletePostRequestParams)
  .addSuccess(DeletePostSuccessResponse, { status: StatusCodes.NO_CONTENT })
  .addError(UnauthorizedError, { status: StatusCodes.UNAUTHORIZED })
  .addError(NotFoundError, { status: StatusCodes.NOT_FOUND })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Delete a post')

export default DeletePostEndpoint
