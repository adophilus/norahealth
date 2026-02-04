import type { CompleteOnboardingRequestBody } from '@nora-health/api/User/CompleteOnboardingEndpoint'
import type { User } from '@nora-health/domain'
import { Effect } from 'effect'
import { DailyMealPlanService } from '@/features/daily-meal-plan/service'
import { HealthProfileService } from '@/features/health-profile/service'

export const completeOnboardingUseCase = (
  payload: CompleteOnboardingRequestBody,
  user: User
) =>
  Effect.gen(function* () {
    const healthProfileService = yield* HealthProfileService

    const healthProfile = yield* healthProfileService.create({
      ...payload,
      user_id: user.id,
      email: user.email
    })

    const dailyMealPlanService = yield* DailyMealPlanService

    const mealPlanResult = yield* dailyMealPlanService.generateWeeklyPlan(
      user.id,
      healthProfile
    )

    return {
      healthProfile,
      weeklyMealPlan: mealPlanResult.dailyPlans,
      mealPlanMessage: mealPlanResult.message
    }
  })
