import { HttpApiEndpoint } from '@effect/platform'
import { StatusCodes } from 'http-status-codes'
import { Schema } from 'effect'
import { OpenApi } from '@effect/platform'
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  UnexpectedError
} from '../common'

export class DisconnectAccountRequestBody extends Schema.TaggedClass<DisconnectAccountRequestBody>()(
  'DisconnectAccountRequestBody',
  {
    account_id: Schema.String
  }
) { }

export class DisconnectAccountSuccessResponse extends Schema.TaggedClass<DisconnectAccountSuccessResponse>()(
  'DisconnectAccountSuccessResponse',
  {
    success: Schema.Boolean
  }
) { }

const DisconnectAccountEndpoint = HttpApiEndpoint.post(
  'disconnectAccount',
  '/integrations/disconnect'
)
  .setPayload(DisconnectAccountRequestBody)
  .addSuccess(DisconnectAccountSuccessResponse, { status: StatusCodes.OK })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnauthorizedError, { status: StatusCodes.UNAUTHORIZED })
  .addError(NotFoundError, { status: StatusCodes.NOT_FOUND })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Disconnect a connected social media account')

export default DisconnectAccountEndpoint
