import { Effect } from 'effect'
import { AuthSessionService } from '../service'
import { AuthTokenService } from '../service/token/interface'
import { UserService } from '@/features/user/service'
import type { VerifyOtpRequestBody } from '@nora-health/api/Auth/VerifyOtpEndpoint'

export const verifyOtpUseCase = (payload: VerifyOtpRequestBody) =>
  Effect.gen(function* () {
    const authSessionService = yield* AuthSessionService
    const authTokenService = yield* AuthTokenService
    const userService = yield* UserService

    const user = yield* userService.findByEmail(payload.email)

    yield* authTokenService.verifyVerificationToken(user.id, payload.otp)

    if (user.status === 'NOT_VERIFIED') {
      yield* userService.verifyById(user.id)
    }

    const session = yield* authSessionService.create(user.id)

    return { user, session }
  })
