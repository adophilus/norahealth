import { HttpApiEndpoint } from '@effect/platform'
import { StatusCodes } from 'http-status-codes'
import {
  UserNotFoundError,
  BadRequestError,
  UnexpectedError,
  Email,
  VerificationOtpAlreadySentError
} from '../common'
import { Schema } from 'effect'
import { OpenApi } from '@effect/platform'

export class ResendVerificationOtpRequestBody extends Schema.Class<ResendVerificationOtpRequestBody>(
  'ResendVerificationOtpRequestBody'
)({
  email: Email
}) {}

export class ResendVerificationOtpSuccessResponse extends Schema.TaggedClass<ResendVerificationOtpSuccessResponse>()(
  'ResendVerificationOtpResponse',
  {}
) {}

const ResendVerificationOtpEndpoint = HttpApiEndpoint.post(
  'resendVerificationOtp',
  '/auth/verification/resend'
)
  .setPayload(ResendVerificationOtpRequestBody)
  .addSuccess(ResendVerificationOtpSuccessResponse, { status: StatusCodes.OK })
  .addError(UserNotFoundError, {
    status: StatusCodes.NOT_FOUND
  })
  .addError(VerificationOtpAlreadySentError, {
    status: StatusCodes.BAD_REQUEST
  })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Resend verification OTP')

export default ResendVerificationOtpEndpoint
