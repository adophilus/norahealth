import { HttpApiEndpoint } from '@effect/platform'
import { StatusCodes } from 'http-status-codes'
import {
  BadRequestError,
  UnexpectedError,
  SessionToken,
  InvalidOrExpiredTokenError
} from '../common'
import { Schema } from 'effect'
import { OpenApi } from '@effect/platform'
import { VerifyAuthSuccessResponse } from './Schemas'

export class VerifySignInWithFarcasterUrlRequestBody extends Schema.Class<VerifySignInWithFarcasterUrlRequestBody>(
  'VerifySignInWithFarcasterUrlRequestBody'
)({
  token: Schema.String
}) {}

const VerifySignInWithFarcasterUrlEndpoint = HttpApiEndpoint.post(
  'verifySignInWithFarcasterUrl',
  '/auth/sign-in/strategy/farcaster/url/verify'
)
  .setPayload(VerifySignInWithFarcasterUrlRequestBody)
  .addSuccess(VerifyAuthSuccessResponse, {
    status: StatusCodes.OK
  })
  .addError(InvalidOrExpiredTokenError, { status: StatusCodes.BAD_REQUEST })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Verify Sign in with Farcaster (SIWF) url')

export default VerifySignInWithFarcasterUrlEndpoint
