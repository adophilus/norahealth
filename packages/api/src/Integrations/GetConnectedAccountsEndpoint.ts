import { HttpApiEndpoint } from '@effect/platform'
import { StatusCodes } from 'http-status-codes'
import { Schema } from 'effect'
import { OpenApi } from '@effect/platform'
import {
  BadRequestError,
  Paginated,
  UnauthorizedError,
  UnexpectedError
} from '../common'

export class GetConnectedAccountsSuccessResponse extends Paginated(
  'GetConnectedAccountsSuccessResponse',
  Schema.Struct({
    id: Schema.String,
    platform: Schema.String,
    platform_account_id: Schema.String,
    platform_username: Schema.String,
    platform_display_name: Schema.NullOr(Schema.String),
    profile_url: Schema.NullOr(Schema.String),
    avatar_url: Schema.NullOr(Schema.String),
    is_active: Schema.Boolean,
    is_primary: Schema.Boolean
  })
) { }

const GetConnectedAccountsEndpoint = HttpApiEndpoint.get(
  'getConnectedAccounts',
  '/integrations/connected-accounts'
)
  .addSuccess(GetConnectedAccountsSuccessResponse, { status: StatusCodes.OK })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnauthorizedError, { status: StatusCodes.UNAUTHORIZED })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(
    OpenApi.Description,
    'Get all connected social media accounts for current user'
  )

export default GetConnectedAccountsEndpoint
