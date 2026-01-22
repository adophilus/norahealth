import { HttpApiEndpoint } from '@effect/platform'
import { StatusCodes } from 'http-status-codes'
import InvalidOrExpiredTokenError from '../common/InvalidOrExpiredTokenError'
import { OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { Otp, UnexpectedError, SessionToken, Email } from '../common' // Changed PhoneNumber to Email
import { VerifyAuthSuccessResponse } from './Schemas'

export class VerifyOtpRequestBody extends Schema.Class<VerifyOtpRequestBody>(
  'VerifyOtpRequestBody'
)({
  email: Email,
  otp: Otp
}) {}

const VerifyOtpEndpoint = HttpApiEndpoint.post(
  'verifyOtp',
  '/auth/verification'
)
  .setPayload(VerifyOtpRequestBody)
  .addSuccess(VerifyAuthSuccessResponse, { status: StatusCodes.OK })
  .addError(InvalidOrExpiredTokenError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Verify OTP')

export default VerifyOtpEndpoint
