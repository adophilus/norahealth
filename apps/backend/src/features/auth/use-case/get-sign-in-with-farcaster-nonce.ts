import { Effect } from 'effect'
import { FarcasterService } from '@/features/farcaster'
import { AuthTokenService } from '../service'

export const getSignInWithFarcasterNonceUseCase = () =>
  Effect.gen(function* () {
    const farcasterService = yield* FarcasterService
    const authTokenService = yield* AuthTokenService

    const nonce = yield* farcasterService.generateNonce()

    yield* authTokenService.create(`SIWF-nonce-${nonce}`)

    return nonce
  })
