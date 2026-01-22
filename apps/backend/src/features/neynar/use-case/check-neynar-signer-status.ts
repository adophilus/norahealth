import { Effect } from 'effect'
import { NeynarService } from '@/features/neynar'

export const checkNeynarSignerStatusUseCase = (signerId: string) =>
  Effect.gen(function* () {
    const neynarService = yield* NeynarService

    const signer = yield* neynarService.findById(signerId)

    const rawSigner = yield* neynarService.lookupRawSignerByUuid(
      signer.signer_uuid
    )

    if (rawSigner.status !== signer.status) {
      yield* neynarService.updateById(signer.id, {
        status: rawSigner.status
      })
    }

    return signer
  })
