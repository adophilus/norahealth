import { Effect } from 'effect'
import { FarcasterService } from '@/features/farcaster'
import { InvalidOrExpiredTokenError } from '@nora-health/api/common'
import { verifyNeynarSignIn } from './utils/verify-neynar-sign-in'
import { AuthTokenService } from '@/features/auth'

export const verifyNeynarSignInUrlUseCase = (token: string) =>
  Effect.gen(function* () {
    const farcasterService = yield* FarcasterService
    const authTokenService = yield* AuthTokenService

    const hashInput = `SIWN-url-${token}`
    yield* authTokenService.verify(hashInput, true)

    const res = yield* farcasterService.verifyChannelToken(token).pipe(
      Effect.catchTags({
        FarcasterServiceError: () =>
          Effect.fail(new InvalidOrExpiredTokenError())
      })
    )

    yield* authTokenService.deleteByHash(hashInput)

    return yield* verifyNeynarSignIn(res)
  })
