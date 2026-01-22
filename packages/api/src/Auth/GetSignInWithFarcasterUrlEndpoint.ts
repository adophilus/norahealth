import { HttpApiEndpoint } from '@effect/platform'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnexpectedError } from '../common'
import { Schema } from 'effect'
import { OpenApi } from '@effect/platform'
import { Url } from '../common'

export class GetSignInWithFarcasterUrlSuccessResponse extends Schema.TaggedClass<GetSignInWithFarcasterUrlSuccessResponse>()(
  'GetSignInWithFarcasterUrlSuccessResponse',
  {
    token: Schema.String,
    url: Url
  }
) {}

const GetSignInWithFarcasterUrlEndpoint = HttpApiEndpoint.get(
  'getSignInWithFarcasterUrl',
  '/auth/sign-in/strategy/farcaster/url/initiate'
)
  .addSuccess(GetSignInWithFarcasterUrlSuccessResponse, {
    status: StatusCodes.OK
  })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Get Sign In With Farcaster (SIWF) url')

export default GetSignInWithFarcasterUrlEndpoint
