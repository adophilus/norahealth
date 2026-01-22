import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import {
  BadRequestError,
  Email,
  TokenNotExpiredError,
  UnexpectedError
} from '../common'

export class SendSignInOtpRequestBody extends Schema.Class<SendSignInOtpRequestBody>(
  'SendSignInOtpRequestBody'
)({
  email: Email
}) {}

export class SendSignInOtpSuccessResponse extends Schema.TaggedClass<SendSignInOtpSuccessResponse>()(
  'SendSignInOtpResponse',
  {}
) {}

const SendSignInOtpEndpoint = HttpApiEndpoint.post(
  'sendSignInOtp',
  '/auth/sign-in/strategy/email'
)
  .setPayload(SendSignInOtpRequestBody)
  .addSuccess(SendSignInOtpSuccessResponse, { status: StatusCodes.OK })
  .addError(TokenNotExpiredError, {
    status: StatusCodes.BAD_REQUEST
  })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Send OTP to sign in user')

export default SendSignInOtpEndpoint
