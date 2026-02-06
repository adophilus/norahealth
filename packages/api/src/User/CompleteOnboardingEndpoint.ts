import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import {
  BadRequestError,
  EmptyMessage,
  HealthProfile,
  UnexpectedError
} from '../common'

export class CompleteOnboardingRequestBody extends Schema.Class<CompleteOnboardingRequestBody>(
  'CompleteOnboardingRequestBody'
)({
  name: HealthProfile.fields.name,
  email: HealthProfile.fields.email,
  age_group: HealthProfile.fields.age_group,
  gender: HealthProfile.fields.gender,
  weight_class: HealthProfile.fields.weight_class,
  injuries: HealthProfile.fields.injuries,
  medical_conditions: HealthProfile.fields.medical_conditions,
  fitness_goals: HealthProfile.fields.fitness_goals,
  weekly_workout_time: HealthProfile.fields.weekly_workout_time,
  allergies: HealthProfile.fields.allergies,
  location: HealthProfile.fields.location
}) {}

const DailyMealPlanResponse = Schema.Struct({
  id: Schema.String,
  user_id: Schema.String,
  date: Schema.String,
  breakfast: Schema.NullOr(Schema.String),
  lunch: Schema.NullOr(Schema.String),
  dinner: Schema.NullOr(Schema.String),
  snacks: Schema.Array(Schema.String),
  notes: Schema.String,
  created_at: Schema.Number,
  updated_at: Schema.NullOr(Schema.Number),
  deleted_at: Schema.NullOr(Schema.Number)
})

export class OnboardingCompletionResponse extends Schema.Class<OnboardingCompletionResponse>(
  'OnboardingCompletionResponse'
)({
  success: Schema.Boolean,
  healthProfile: HealthProfile,
  weeklyMealPlan: Schema.Array(DailyMealPlanResponse),
  message: Schema.String
}) {}

const CompleteOnboardingEndpoint = HttpApiEndpoint.put(
  'completeOnboarding',
  '/user/onboarding'
)
  .setPayload(CompleteOnboardingRequestBody)
  .addSuccess(EmptyMessage, { status: StatusCodes.NO_CONTENT })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(
    OpenApi.Description,
    'Complete user onboarding and generate initial meal plan'
  )

export default CompleteOnboardingEndpoint
