import { HttpApiEndpoint, HttpApiSchema } from '@effect/platform'
import { StatusCodes } from 'http-status-codes'
import { OpenApi } from '@effect/platform'
import {
  BadRequestError,
  UnexpectedError,
  ImageFiles,
  MediaDescription
} from '../common'
import { Schema } from 'effect'
import AuthenticationMiddleware from '../Auth/AuthenticationMiddleware'

export class UploadMediaRequestBody extends Schema.Class<UploadMediaRequestBody>("UploadMediaRequestBody")({
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
