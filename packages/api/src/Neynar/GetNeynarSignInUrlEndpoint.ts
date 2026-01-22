import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnexpectedError } from '../common'

export class GetNeynarSignInUrlSuccessResponse extends Schema.TaggedClass<GetNeynarSignInUrlSuccessResponse>()(
  'GetNeynarSignInUrlSuccessResponse',
  {
    url: Schema.String,
    token: Schema.String
  }
) {}

const GetNeynarSignInUrlEndpoint = HttpApiEndpoint.get(
  'getNeynarSignInUrl',
  '/integrations/neynar/sign-in/url'
)
  .addSuccess(GetNeynarSignInUrlSuccessResponse, { status: StatusCodes.OK })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Get Neynar sign-in URL for QR code flow')

export default GetNeynarSignInUrlEndpoint
