import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, EmptyMessage, HexString, UnexpectedError } from '../common'
import { SignerApprovalRequiredResponse } from './Schemas'

export class VerifyNeynarSignInNonceRequestBody extends Schema.TaggedClass<VerifyNeynarSignInNonceRequestBody>()(
  'VerifyNeynarSignInNonceRequestBody',
  {
    nonce: Schema.String,
    signature: HexString,
    message: Schema.String
  }
) {}

const VerifyNeynarSignInNonceEndpoint = HttpApiEndpoint.post(
  'verifyNeynarSignInNonce',
  '/integrations/neynar/verify/nonce'
)
  .setPayload(VerifyNeynarSignInNonceRequestBody)
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
    'Verify Neynar sign-in nonce with wallet signature'
  )

export default VerifyNeynarSignInNonceEndpoint
