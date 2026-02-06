import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import _ from 'lodash'
import {
  BadRequestError,
  EmptyMessage,
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
) {}

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
