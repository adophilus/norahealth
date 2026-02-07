import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { DailyWorkoutPlan } from '@nora-health/domain'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { UnexpectedError } from '../common'

export class GetWorkoutPlanPathParams extends Schema.Class<GetWorkoutPlanPathParams>(
  'GetWorkoutPlanPathParams'
)({
  start_date: Schema.String,
  end_date: Schema.String
}) {}

const GetWorkoutPlanEndpoint = HttpApiEndpoint.get(
  'getWorkoutPlan',
  '/workout-plan/:start_date/:end_date'
)
  .setPath(GetWorkoutPlanPathParams)
  .addSuccess(Schema.Array(DailyWorkoutPlan), { status: StatusCodes.OK })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(
    OpenApi.Description,
    'Get daily workout plan for the specified date range'
  )

export default GetWorkoutPlanEndpoint
