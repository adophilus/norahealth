import { HttpApiEndpoint } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import AuthenticationMiddleware from '../Auth/AuthenticationMiddleware'
import { EmptyMessage, PushToken, UnexpectedError } from '../common'

// Register push notification token
export class RegisterPushTokenRequestBody extends Schema.Class<RegisterPushTokenRequestBody>(
  'RegisterPushTokenRequestBody'
)({
  token: PushToken
}) {}

const RegisterPushTokenEndpoint = HttpApiEndpoint.post(
  'registerPushToken',
  '/notifications/push-token'
)
  .setPayload(RegisterPushTokenRequestBody)
  .addSuccess(EmptyMessage)
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .middleware(AuthenticationMiddleware)

export default RegisterPushTokenEndpoint
