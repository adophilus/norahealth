import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, Id, UnexpectedError } from '../common'
import { Schema } from 'effect'

export class CheckNeynarSignerStatusRequestParams extends Schema.Class<CheckNeynarSignerStatusRequestParams>(
  'CheckNeynarSignerStatusRequestParams'
)({
  id: Id
}) {}

export class CheckNeynarSignerStatusResponse extends Schema.TaggedClass<CheckNeynarSignerStatusResponse>()(
  'CheckNeynarSignerStatusResponse',
  {
    status: Schema.Union(
      Schema.Literal('ACTIVE'),
      Schema.Literal('PENDING_APPROVAL'),
      Schema.Literal('REVOKED')
    )
  }
) {}

const CheckNeynarSignerStatusEndpoint = HttpApiEndpoint.get(
  'checkNeynarSignerStatus',
  '/integrations/neynar/signer/:id/status'
)
  .setPath(CheckNeynarSignerStatusRequestParams)
  .addSuccess(CheckNeynarSignerStatusResponse, { status: StatusCodes.OK })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Check Neynar signer status by id for polling')

export default CheckNeynarSignerStatusEndpoint
