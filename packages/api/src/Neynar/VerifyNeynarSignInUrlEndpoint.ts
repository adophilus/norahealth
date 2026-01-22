import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, EmptyMessage, UnexpectedError } from '../common'
import { SignerApprovalRequiredResponse } from './Schemas'

export class VerifyNeynarSignInUrlRequestBody extends Schema.TaggedClass<VerifyNeynarSignInUrlRequestBody>()(
  'VerifyNeynarSignInUrlRequestBody',
  {
    token: Schema.String
  }
) {}

const VerifyNeynarSignInUrlEndpoint = HttpApiEndpoint.post(
  'verifyNeynarSignInUrl',
  '/integrations/neynar/verify/url'
)
  .setPayload(VerifyNeynarSignInUrlRequestBody)
  .addSuccess(EmptyMessage, {
    status: StatusCodes.NO_CONTENT
  })
  .addSuccess(SignerApprovalRequiredResponse, {
    status: StatusCodes.OK
  })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(
    OpenApi.Description,
    'Verify Neynar sign-in URL with SIWF signature'
  )

export default VerifyNeynarSignInUrlEndpoint
