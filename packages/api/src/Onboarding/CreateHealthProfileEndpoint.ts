import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { HealthProfile } from '@nora-health/domain'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnauthorizedError } from '../common'

export class CreateHealthProfileRequestBody extends Schema.Class<CreateHealthProfileRequestBody>(
  'CreateHealthProfileRequestBody'
)({
  resolution_class: Schema.Literal('PERFORMANCE', 'VITALITY', 'LONGEVITY'),
  dietary_exclusions: Schema.Array(
    Schema.Literal(
      'PEANUTS',
      'DAIRY',
      'GLUTEN',
      'SOY',
      'EGGS',
      'SHELLFISH',
      'TREE_NUTS',
      'FISH'
    )
  ),
  physical_constraints: Schema.Array(
    Schema.Literal('KNEE', 'BACK', 'SHOULDER', 'HIP', 'ANKLE', 'WRIST', 'OTHER')
  ),
  medical_redlines: Schema.Array(Schema.String),
  fitness_goals: Schema.Array(Schema.String),
  fitness_level: Schema.Literal('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
  location_city: Schema.String,
  location_zip_code: Schema.String
}) {}

const CreateHealthProfileEndpoint = HttpApiEndpoint.post(
  'createHealthProfile',
  '/onboarding/health-profile'
)
  .setPayload(CreateHealthProfileRequestBody)
  .addSuccess(HealthProfile, { status: StatusCodes.CREATED })
  .addError(BadRequestError, { status: StatusCodes.BAD_REQUEST })
  .addError(UnauthorizedError, { status: StatusCodes.UNAUTHORIZED })
  .annotate(OpenApi.Description, 'Create user health profile')

export default CreateHealthProfileEndpoint
