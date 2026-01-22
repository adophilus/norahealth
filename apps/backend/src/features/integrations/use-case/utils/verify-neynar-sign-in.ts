import { Effect, Option } from 'effect'
import { ulid } from 'ulidx'
import type { HexString, } from '@nora-health/domain'
import { ConnectedAccountRepository } from '../../repository'
import { NeynarService } from '@/features/neynar'
import { CurrentUser } from '@nora-health/api/common'

export const verifyNeynarSignIn = ({
  message,
  signature
}: {
  message: string
  signature: HexString
}) =>
  Effect.gen(function* () {
    const connectedAccountRepository = yield* ConnectedAccountRepository
    const neynarService = yield* NeynarService
    const user = yield* CurrentUser

    const signers = yield* neynarService.fetchRawSigners({ message, signature })

    const rawSigner = signers.find((s) => s.status === 'approved')

    if (!rawSigner) {
      yield* connectedAccountRepository
        .findByUserIdAndPlatform(user.id, 'FARCASTER')
        .pipe(
          Effect.flatMap(
            Option.match({
              onNone: () => Effect.void,
              onSome: (ca) => connectedAccountRepository.softDelete(ca.id)
            })
          )
        )

      const connectedAccount = yield* connectedAccountRepository.create({
        id: ulid(),
        platform_username: '',
        user_id: user.id,
        is_active: false,
        is_primary: true,
        platform: 'FARCASTER',
        platform_account_id: ''
      })

      const signer = yield* neynarService.create({
        id: ulid(),
        connected_account_id: connectedAccount.id
      })

      const approvedSigner = yield* neynarService.registerSignedKey(signer)

      return approvedSigner
    }

    return yield* neynarService.findBySignerUuid(rawSigner.signer_uuid)
  })
