import { Effect, Option } from 'effect'
import { UserRepository } from '@/features/user/repository'
import { AuthTokenService } from '../service/token/interface'
import type { ResendVerificationOtpRequestBody } from '@nora-health/api/Auth/ResendVerificationOtpEndpoint'
import { UserNotFoundError } from '@nora-health/api/common/index'
import { User } from '@nora-health/domain'

export const resendVerificationOtpUseCase = (
  payload: ResendVerificationOtpRequestBody
) =>
  Effect.gen(function* () {
    const userRepository = yield* UserRepository
    const authTokenService = yield* AuthTokenService

    const userOption = yield* userRepository.findByEmail(
      payload.email
    )

    if (Option.isNone(userOption)) {
      return yield* Effect.fail(new UserNotFoundError())
    }

    const user = User.make(userOption.value)

    yield* authTokenService.createVerificationToken(user)

    return user
  })
