import { HttpApiBuilder } from '@effect/platform'
import { Api } from '@nora-health/api'
import { EmptyMessage, UnexpectedError } from '@nora-health/api/common'
import { SignerApprovalRequiredResponse } from '@nora-health/api/Neynar/Schemas'
import { Effect } from 'effect'
import { verifyNeynarSignInUrlUseCase } from '../use-case'

const VerifyNeynarSignInUrlEndpointLive = HttpApiBuilder.handler(
  Api,
  'Neynar',
  'verifyNeynarSignInUrl',
  ({ payload }) =>
    Effect.gen(function* () {
      const signer = yield* verifyNeynarSignInUrlUseCase(payload.token)

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

export default VerifyNeynarSignInUrlEndpointLive
