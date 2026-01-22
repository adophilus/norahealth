import { HttpApiEndpoint } from '@effect/platform'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, HexString, UnexpectedError } from '../common'
import { Schema } from 'effect'
import { OpenApi } from '@effect/platform'

export class GetSignInWithFarcasterNonceSuccessResponse extends Schema.TaggedClass<GetSignInWithFarcasterNonceSuccessResponse>()(
  'GetSignInWithFarcasterNonceSuccessResponse',
  {
    nonce: Schema.String,
  }
) {}

const GetSignInWithFarcasterNonceEndpoint = HttpApiEndpoint.get(
  'getSignInWithFarcasterNonce',
  '/auth/sign-in/strategy/farcaster/nonce/initiate'
)
  .addSuccess(GetSignInWithFarcasterNonceSuccessResponse, {
    status: StatusCodes.OK
  })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Get Sign In With Farcaster (SIWF) nonce')

export default GetSignInWithFarcasterNonceEndpoint
