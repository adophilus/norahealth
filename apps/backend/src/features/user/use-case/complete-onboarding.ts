import type { User } from '@nora-health/domain'
import { Effect } from 'effect'
import { HealthProfileService } from '@/features/health-profile/service'
import type { CompleteOnboardingRequestBody } from '@nora-health/api/User/CompleteOnboardingEndpoint'

export const completeOnboardingUseCase = (
  payload: CompleteOnboardingRequestBody,
  user: User,
) =>
  Effect.gen(function*() {
    const healthProfileService = yield* HealthProfileService

    yield* healthProfileService.create({
      ...payload,
      user_id: user.id,
      email: user.email,
    })
  })
