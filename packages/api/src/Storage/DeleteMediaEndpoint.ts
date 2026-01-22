import { HttpApiEndpoint } from '@effect/platform'
import { StatusCodes } from 'http-status-codes'
import { OpenApi } from '@effect/platform'
import {
  FileNotFoundError,
  UnauthorizedError,
  UnexpectedError,
  Id
} from '../common'
import { Schema } from 'effect'
import AuthenticationMiddleware from '../Auth/AuthenticationMiddleware'

export class DeleteMediaRequestPath extends Schema.Class<DeleteMediaRequestPath>("DeleteMediaRequestPath")({
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
  .addSuccess(DeleteMediaSuccessResponse, { status: StatusCodes.OK })
  .addError(FileNotFoundError, {
    status: StatusCodes.NOT_FOUND
  })
  .addError(UnauthorizedError, { status: StatusCodes.UNAUTHORIZED })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .middleware(AuthenticationMiddleware)
  .annotate(OpenApi.Description, 'Delete a media file by ID')

export default DeleteMediaEndpoint
