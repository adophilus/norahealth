import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { DailyMealPlan } from '@nora-health/domain'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { UnexpectedError } from '../common'

export class GetDailyMealPlanPathParams extends Schema.Class<GetDailyMealPlanPathParams>(
  'GetWeeklyPlanPathParams'
)({
  start_date: Schema.String,
  end_date: Schema.String
}) {}

const GetDailyMealPlanEndpoint = HttpApiEndpoint.get(
  'getDailyMealPlan',
  '/daily-meal-plan/:start_date/:end_date'
)
  .setPath(GetDailyMealPlanPathParams)
  .addSuccess(Schema.Array(DailyMealPlan))
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(
    OpenApi.Description,
    'Get daily meal plan for the specified date range'
  )

export default GetDailyMealPlanEndpoint
