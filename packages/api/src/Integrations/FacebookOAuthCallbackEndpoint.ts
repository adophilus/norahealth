import { HttpApiEndpoint } from '@effect/platform'
import { StatusCodes } from 'http-status-codes'
import { Schema } from 'effect'
import { OpenApi } from '@effect/platform'
import { BadRequestError, UnexpectedError } from '../common'

export class FacebookOAuthCallbackRequestBody extends Schema.TaggedClass<FacebookOAuthCallbackRequestBody>()(
  'FacebookOAuthCallbackRequestBody',
  {
    code: Schema.String,
    state: Schema.String
  }
) {}

export class FacebookOAuthCallbackSuccessResponse extends Schema.TaggedClass<FacebookOAuthCallbackSuccessResponse>()(
  'FacebookOAuthCallbackSuccessResponse',
  {
    success: Schema.Boolean
  }
) {}

const FacebookOAuthCallbackEndpoint = HttpApiEndpoint.get(
  'facebookOAuthCallback',
  '/integrations/facebook/oauth/callback'
)
  .setPayload(FacebookOAuthCallbackRequestBody)
  .addSuccess(FacebookOAuthCallbackSuccessResponse, { status: StatusCodes.OK })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(
    OpenApi.Description,
    'Handle Facebook OAuth callback - exchange code for tokens'
  )

export default FacebookOAuthCallbackEndpoint
