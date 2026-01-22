import { Effect } from 'effect'
import { FarcasterService } from '@/features/farcaster'
import { AuthTokenService } from '@/features/auth'

export const getNeynarSignInNonceUseCase = () =>
  Effect.gen(function* () {
    const farcasterService = yield* FarcasterService
    const authTokenService = yield* AuthTokenService

    const nonce = yield* farcasterService.generateNonce()

    yield* authTokenService.create(`SIWN-nonce-${nonce}`)

    return nonce
  })
