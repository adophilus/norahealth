import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnauthorizedError } from '../common'

export class UploadFridgePhotoRequestBody extends Schema.Class<UploadFridgePhotoRequestBody>(
  'UploadFridgePhotoRequestBody'
)({
  image: Schema.String
}) {}

export class UploadFridgePhotoSuccessResponse extends Schema.Class<UploadFridgePhotoSuccessResponse>(
  'UploadFridgePhotoSuccessResponse'
)({
  pantry_items: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      quantity: Schema.String,
      estimated_freshness: Schema.String
    })
  ),
  ingredient_list: Schema.Array(Schema.String)
}) {}

const UploadFridgePhotoEndpoint = HttpApiEndpoint.post(
  'uploadFridgePhoto',
  '/meals/upload-fridge-photo'
)
  .setPayload(UploadFridgePhotoRequestBody)
  .addSuccess(UploadFridgePhotoSuccessResponse, { status: StatusCodes.CREATED })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnauthorizedError, { status: StatusCodes.UNAUTHORIZED })
  .annotate(OpenApi.Description, 'Upload fridge photo for ingredient analysis')

export default UploadFridgePhotoEndpoint
