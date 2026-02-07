import { HttpApiEndpoint, HttpApiSchema, OpenApi } from '@effect/platform'
import { MediaDescription } from '@nora-health/domain'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import AuthenticationMiddleware from '../Auth/AuthenticationMiddleware'
import { BadRequestError, ImageFiles, UnexpectedError } from '../common'

export class UploadMediaRequestBody extends Schema.Class<UploadMediaRequestBody>(
  'UploadMediaRequestBody'
)({
  files: ImageFiles
}) {}

const Request = HttpApiSchema.Multipart(
  UploadMediaRequestBody // Use the new class here
).annotations({
  description: 'Upload media request body'
})

export class UploadMediaSuccessResponse extends Schema.TaggedClass<UploadMediaSuccessResponse>()(
  'UploadMediaResponse',
  {
    data: Schema.Array(MediaDescription)
  }
) {}

const UploadMediaEndpoint = HttpApiEndpoint.post(
  'uploadMedia',
  '/storage/upload'
)
  .setPayload(Request)
  .addSuccess(UploadMediaSuccessResponse, { status: StatusCodes.OK })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .middleware(AuthenticationMiddleware)
  .annotate(OpenApi.Description, 'Upload multiple media files')

export default UploadMediaEndpoint
