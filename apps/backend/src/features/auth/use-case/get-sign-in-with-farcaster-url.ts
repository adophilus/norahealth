import { Effect } from 'effect'
import { FarcasterService } from '@/features/farcaster'
import { AuthTokenService } from '../service'

export const getSignInWithFarcasterUrlUseCase = () =>
  Effect.gen(function* () {
    const farcasterService = yield* FarcasterService
    const authTokenService = yield* AuthTokenService

    const { token, url } = yield* farcasterService.generateAuthCredentials()

    yield* authTokenService.create(`SIWF-url-${token}`)

    return { token, url }
  })
