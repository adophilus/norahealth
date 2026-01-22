import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import {
  BadRequestError,
  Id,
  NeynarSignerStatus,
  UnexpectedError
} from '../common'

export class CheckNeynarSignerStatusRequestParams extends Schema.Class<CheckNeynarSignerStatusRequestParams>(
  'CheckNeynarSignerStatusRequestParams'
)({
  id: Id
}) {}

export class CheckNeynarSignerStatusSuccessResponse extends Schema.TaggedClass<CheckNeynarSignerStatusSuccessResponse>()(
  'CheckNeynarSignerStatusSuccessResponse',
  {
    status: NeynarSignerStatus
  }
) {}

const CheckNeynarSignerStatusEndpoint = HttpApiEndpoint.get(
  'checkNeynarSignerStatus',
  '/integrations/neynar/:id/status'
)
  .setPath(CheckNeynarSignerStatusRequestParams)
  .addSuccess(CheckNeynarSignerStatusSuccessResponse, {
    status: StatusCodes.OK
  })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, 'Get Neynar sign-in URL for QR code flow')

export default CheckNeynarSignerStatusEndpoint
