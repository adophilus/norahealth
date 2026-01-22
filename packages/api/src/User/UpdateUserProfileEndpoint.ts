import { HttpApiEndpoint } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { Id, EmptyMessage, UnexpectedError } from '../common'

export class UpdateUserProfileRequestBody extends Schema.Class<UpdateUserProfileRequestBody>(
  'UpdateUserProfileRequestBody'
)({
  profile_picture_id: Schema.optional(Id)
}) {}

const UpdateUserProfileEndpoint = HttpApiEndpoint.patch(
  'updateUserProfile',
  '/users/profile'
)
  .setPayload(UpdateUserProfileRequestBody)
  .addSuccess(EmptyMessage)
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })

export default UpdateUserProfileEndpoint
