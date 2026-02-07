import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Email, Otp, User } from '@nora-health/domain'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { SessionToken, UnexpectedError } from '../common' // Changed PhoneNumber to Email
import InvalidOrExpiredTokenError from '../common/InvalidOrExpiredTokenError'

export class VerifyOtpRequestBody extends Schema.Class<VerifyOtpRequestBody>(
  'VerifyOtpRequestBody'
)({
  email: Email,
  otp: Otp
}) {}

export class VerifyOtpSuccessResponse extends Schema.Class<VerifyOtpSuccessResponse>(
  'VerifyOtpSuccessResponse'
)({
  user: User,
  access_token: SessionToken
}) {}

const VerifyOtpEndpoint = HttpApiEndpoint.post(
  'verifyOtp',
  '/auth/verification'
)
  .setPayload(VerifyOtpRequestBody)
  .addSuccess(VerifyOtpSuccessResponse)
  .addError(InvalidOrExpiredTokenError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Verify OTP')

export default VerifyOtpEndpoint
