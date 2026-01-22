import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { EmptyMessage, UnexpectedError } from '@nora-health/api/common'
import { SignerApprovalRequiredResponse } from '@nora-health/api/Neynar/Schemas'
import { Effect } from 'effect'
import { verifyNeynarSignInNonceUseCase } from '../use-case'

const VerifyNeynarSignInNonceEndpointLive = HttpApiBuilder.handler(
  Api,
  'Neynar',
  'verifyNeynarSignInNonce',
  ({ payload }) =>
    Effect.gen(function* () {
      const signer = yield* verifyNeynarSignInNonceUseCase(payload)

      if (signer.status !== 'approved') {
        return SignerApprovalRequiredResponse.make({
          id: signer.id,
          url: signer.approval!.url
        })
      }

      return EmptyMessage.make({})
    }).pipe(
      Effect.catchAll((error) =>
        Effect.fail(new UnexpectedError({ message: error.message }))
      )
    )
)

export default VerifyNeynarSignInNonceEndpointLive
