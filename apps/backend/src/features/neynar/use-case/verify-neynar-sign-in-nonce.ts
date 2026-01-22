import { Effect } from 'effect'
import type { VerifyNeynarSignInNonceRequestBody } from '@nora-health/api/Neynar/VerifyNeynarSignInNonceEndpoint'
import { AuthTokenService } from '@/features/auth'
import { FarcasterService } from '@/features/farcaster'
import { InvalidOrExpiredTokenError } from '@nora-health/api/common'
import { verifyNeynarSignIn } from './utils/verify-neynar-sign-in'

export const verifyNeynarSignInNonceUseCase = (
  payload: VerifyNeynarSignInNonceRequestBody
) =>
  Effect.gen(function* () {
    const farcasterService = yield* FarcasterService
    const authTokenService = yield* AuthTokenService

    const hashInput = `SIWN-nonce-${payload.nonce}`
    yield* authTokenService.verify(hashInput, true)

    const res = yield* farcasterService.verifySignedData(payload).pipe(
      Effect.catchTags({
        FarcasterServiceError: () =>
          Effect.fail(new InvalidOrExpiredTokenError())
      })
    )

    yield* authTokenService.deleteByHash(hashInput)

    return yield* verifyNeynarSignIn(res)
  })
