import { Effect } from 'effect'
import { FarcasterService } from '@/features/farcaster'
import { AuthTokenService } from '@/features/auth'

export const getNeynarSignInUrlUseCase = () =>
  Effect.gen(function* () {
    const farcasterService = yield* FarcasterService
    const authTokenService = yield* AuthTokenService

    const { token, url } = yield* farcasterService.generateAuthCredentials()

    yield* authTokenService.create(`SIWN-url-${token}`)

    return { token, url }
  })
