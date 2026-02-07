import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Email } from '@nora-health/domain'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import {
  BadRequestError,
  EmptyMessage,
  TokenNotExpiredError,
  UnexpectedError
} from '../common'

export class SendSignInOtpRequestBody extends Schema.Class<SendSignInOtpRequestBody>(
  'SendSignInOtpRequestBody'
)({
  email: Email
}) {}

const SendSignInOtpEndpoint = HttpApiEndpoint.post(
  'sendSignInOtp',
  '/auth/sign-in/strategy/email'
)
  .setPayload(SendSignInOtpRequestBody)
  .addSuccess(EmptyMessage, { status: StatusCodes.NO_CONTENT })
  .addError(TokenNotExpiredError, {
    status: StatusCodes.BAD_REQUEST
  })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Send OTP to sign in user')

export default SendSignInOtpEndpoint
