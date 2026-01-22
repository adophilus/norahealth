import { HttpApiEndpoint } from '@effect/platform'
import { StatusCodes } from 'http-status-codes'
import { Schema } from 'effect'
import { OpenApi } from '@effect/platform'
import { BadRequestError, UnexpectedError } from '../common'

export class InitiateFacebookOAuthSuccessResponse extends Schema.TaggedClass<InitiateFacebookOAuthSuccessResponse>()(
  'InitiateFacebookOAuthSuccessResponse',
  {
    auth_url: Schema.String
  }
) { }

const InitiateFacebookOAuthEndpoint = HttpApiEndpoint.get(
  'initiateFacebookOAuth',
  '/integrations/facebook/oauth/start'
)
  .addSuccess(InitiateFacebookOAuthSuccessResponse, { status: StatusCodes.OK })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(
    OpenApi.Description,
    'Initiate Facebook OAuth flow - returns authorization URL'
  )

export default InitiateFacebookOAuthEndpoint
