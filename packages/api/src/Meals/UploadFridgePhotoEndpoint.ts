import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnexpectedError } from '../common'

export class UploadFridgePhotoResponseBody extends Schema.Class<UploadFridgePhotoResponseBody>(
    'UploadFridgePhotoResponseBody'
)({
    photoUrl: Schema.String.annotations({
        title: 'Photo URL',
        description: 'URL of the uploaded fridge photo'
    }),
    analysisId: Schema.String.annotations({
        title: 'Analysis ID',
        description: 'Unique identifier for the photo analysis'
    })
}) {}

const UploadFridgePhotoEndpoint = HttpApiEndpoint.post(
    'uploadFridgePhoto',
    '/meals/fridge-photo'
)
    .setPayload(
        Schema.Struct({
            photo: Schema.String.annotations({
                title: 'Photo',
                description: 'Base64 encoded fridge photo'
            })
        })
    )
    .addSuccess(UploadFridgePhotoResponseBody, { status: StatusCodes.OK })
    .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
    .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
    .annotate(
        OpenApi.Description,
        'Upload and analyze a fridge photo to extract available ingredients'
    )

export default UploadFridgePhotoEndpoint