import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { Email } from '@nora-health/domain'
import { StatusCodes } from 'http-status-codes'
import { UnexpectedError } from '../common'

export class AddWaitlistEntryRequestBody extends Schema.Class<AddWaitlistEntryRequestBody>(
  'AddWaitlistEntryRequestBody'
)({
  email: Email
}) {}

export class AddWaitlistEntrySuccessResponse extends Schema.Class<AddWaitlistEntrySuccessResponse>(
  'AddWaitlistEntrySuccessResponse'
)({}) {}

const AddWaitlistEntryEndpoint = HttpApiEndpoint.post(
  'addWaitlistEntry',
  '/waitlist'
)
  .setPayload(AddWaitlistEntryRequestBody)
  .addSuccess(AddWaitlistEntrySuccessResponse, { status: StatusCodes.CREATED })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Add an email to the waitlist')

export default AddWaitlistEntryEndpoint
