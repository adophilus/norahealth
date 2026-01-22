import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnexpectedError } from '../common'

export class GetNeynarSignInNonceSuccessResponse extends Schema.TaggedClass<GetNeynarSignInNonceSuccessResponse>()(
  'GetNeynarSignInNonceSuccessResponse',
  {
    nonce: Schema.String
  }
) {}

const GetNeynarSignInNonceEndpoint = HttpApiEndpoint.get(
  'getNeynarSignInNonce',
  '/integrations/neynar/sign-in/nonce'
)
  .addSuccess(GetNeynarSignInNonceSuccessResponse, { status: StatusCodes.OK })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(
    OpenApi.Description,
    'Get Neynar sign-in nonce for wallet signature flow'
  )

export default GetNeynarSignInNonceEndpoint
