import { HttpApiEndpoint, HttpApiSchema, OpenApi } from '@effect/platform'
import { Id } from '@nora-health/domain'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import {
  FileNotFoundError,
  UnauthorizedError,
  UnexpectedError
} from '../common'

export class GetMediaRequestPath extends Schema.Class<GetMediaRequestPath>(
  'GetMediaRequestPath'
)({
  fileId: Id
}) {}

export const GetMediaSuccessResponse = Schema.Uint8ArrayFromSelf.pipe(
  HttpApiSchema.withEncoding({
    kind: 'Uint8Array',
    contentType: 'application/octet-stream'
  })
).pipe(
  Schema.annotations({
    identifier: 'GetMediaSuccessResponse',
    title: 'Get Media Success Response',
    description: 'Success response containing the media file content'
  })
)

const GetMediaEndpoint = HttpApiEndpoint.get('getMedia', '/storage/:fileId')
  .setPath(GetMediaRequestPath)
  .addSuccess(GetMediaSuccessResponse)
  .addError(FileNotFoundError, {
    status: StatusCodes.NOT_FOUND
  })
  .addError(UnauthorizedError, { status: StatusCodes.UNAUTHORIZED })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Get a single media file by ID')

export default GetMediaEndpoint
