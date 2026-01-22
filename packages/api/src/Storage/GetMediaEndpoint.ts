import { HttpApiEndpoint, HttpApiSchema } from '@effect/platform'
import { StatusCodes } from 'http-status-codes'
import { OpenApi } from '@effect/platform'
import {
  FileNotFoundError,
  UnauthorizedError,
  UnexpectedError,
  Id
} from '../common'
import { Schema } from 'effect'

export class GetMediaRequestPath extends Schema.Class<GetMediaRequestPath>("GetMediaRequestPath")({
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
  .addSuccess(GetMediaSuccessResponse, { status: StatusCodes.OK })
  .addError(FileNotFoundError, {
    status: StatusCodes.NOT_FOUND
  })
  .addError(UnauthorizedError, { status: StatusCodes.UNAUTHORIZED })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Get a single media file by ID')

export default GetMediaEndpoint
