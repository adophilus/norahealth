import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import type { DailyMealPlan } from '@nora-health/domain'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import _ from 'lodash'
import {
  BadRequestError,
  HealthProfile, 
  UnexpectedError
} from '../common'

export class CompleteOnboardingRequestBody extends Schema.Class<CompleteOnboardingRequestBody>(
  'CompleteOnboardingRequestBody'
)(
  _.omit(HealthProfile.fields, [
    'id',
    'user_id',
    'email',
    'created_at',
    'updated_at'
  ])
)

export type OnboardingCompletionResponse = {
  success: boolean
  healthProfile: HealthProfile
  weeklyMealPlan: Array<DailyMealPlan>
  message: string
}

const CompleteOnboardingEndpoint = HttpApiEndpoint.put(
  'completeOnboarding',
  '/user/onboarding'
)
  .setPayload(CompleteOnboardingRequestBody)
  .addSuccess(OnboardingCompletionResponse, { status: StatusCodes.OK })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(
    OpenApi.Description,
    'Complete user onboarding and generate initial meal plan'
  )

export default CompleteOnboardingEndpoint

