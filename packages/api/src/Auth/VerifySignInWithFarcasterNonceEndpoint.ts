import { HttpApiEndpoint } from '@effect/platform'
import { StatusCodes } from 'http-status-codes'
import {
  BadRequestError,
  UnexpectedError,
  SessionToken,
  InvalidOrExpiredTokenError,
  HexString
} from '../common'
import { Schema } from 'effect'
import { OpenApi } from '@effect/platform'
import { VerifyAuthSuccessResponse } from './Schemas'

export class VerifySignInWithFarcasterNonceRequestBody extends Schema.Class<VerifySignInWithFarcasterNonceRequestBody>(
  'VerifySignInWithFarcasterNonceRequestBody'
)({
  nonce: Schema.String,
  signature: HexString,
  message: Schema.String
}) {}

const VerifySignInWithFarcasterNonceEndpoint = HttpApiEndpoint.post(
  'verifySignInWithFarcasterNonce',
  '/auth/sign-in/strategy/farcaster/nonce/verify'
)
  .setPayload(VerifySignInWithFarcasterNonceRequestBody)
  .addSuccess(VerifyAuthSuccessResponse, {
    status: StatusCodes.OK
  })
  .addError(InvalidOrExpiredTokenError, { status: StatusCodes.BAD_REQUEST })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Verify Sign in with Farcaster (SIWF) nonce')

export default VerifySignInWithFarcasterNonceEndpoint
