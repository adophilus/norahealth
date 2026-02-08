import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Id } from '@nora-health/domain'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import AuthenticationMiddleware from '../Auth/AuthenticationMiddleware'
import {
  FileNotFoundError,
  UnauthorizedError,
  UnexpectedError
} from '../common'

export class DeleteMediaRequestPath extends Schema.Class<DeleteMediaRequestPath>(
  'DeleteMediaRequestPath'
)({
  fileId: Id
}) {}

export class DeleteMediaSuccessResponse extends Schema.TaggedClass<DeleteMediaSuccessResponse>()(
  'DeleteMediaResponse',
  {}
) {}

const DeleteMediaEndpoint = HttpApiEndpoint.del(
  'deleteMedia',
  '/storage/:fileId'
)
  .setPath(DeleteMediaRequestPath)
  .addSuccess(DeleteMediaSuccessResponse)
  .addError(FileNotFoundError, {
    status: StatusCodes.NOT_FOUND
  })
  .addError(UnauthorizedError, { status: StatusCodes.UNAUTHORIZED })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .middleware(AuthenticationMiddleware)
  .annotate(OpenApi.Description, 'Delete a media file by ID')

export default DeleteMediaEndpoint
