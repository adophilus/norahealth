import { Effect } from 'effect'
import { FarcasterService } from '@/features/farcaster'
import { AuthTokenService } from '../service'
import { InvalidOrExpiredTokenError } from '@nora-health/api/common'
import type { VerifySignInWithFarcasterNonceRequestBody } from '@nora-health/api/Auth/VerifySignInWithFarcasterNonceEndpoint'
import { verifySignInWithFarcaster } from './utils/verify-sign-in-with-farcaster'

export const verifySignInWithFarcasterNonceUseCase = (
  payload: VerifySignInWithFarcasterNonceRequestBody
) =>
  Effect.gen(function* () {
    const farcasterService = yield* FarcasterService
    const authTokenService = yield* AuthTokenService

    const hashInput = `SIWF-nonce-${payload.nonce}`
    yield* authTokenService.verify(hashInput, true)

    const res = yield* farcasterService.verifySignedData(payload).pipe(
      Effect.catchTags({
        FarcasterServiceError: () =>
          Effect.fail(new InvalidOrExpiredTokenError())
      })
    )

    yield* authTokenService.deleteByHash(hashInput)

    return yield* verifySignInWithFarcaster(res)
  })
