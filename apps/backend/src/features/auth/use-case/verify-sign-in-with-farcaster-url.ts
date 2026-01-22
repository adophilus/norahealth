import { Effect } from 'effect'
import { FarcasterService } from '@/features/farcaster'
import { AuthTokenService } from '../service'
import { InvalidOrExpiredTokenError } from '@nora-health/api/common'
import { verifySignInWithFarcaster } from './utils/verify-sign-in-with-farcaster'

export const verifySignInWithFarcasterUrlUseCase = (token: string) =>
  Effect.gen(function* () {
    const farcasterService = yield* FarcasterService
    const authTokenService = yield* AuthTokenService

    const hashInput = `SIWF-url-${token}`
    yield* authTokenService.verify(hashInput, true)

    const res = yield* farcasterService.verifyChannelToken(token).pipe(
      Effect.catchTags({
        FarcasterServiceError: () =>
          Effect.fail(new InvalidOrExpiredTokenError())
      })
    )

    yield* authTokenService.deleteByHash(hashInput)

    return yield* verifySignInWithFarcaster(res)
  })
