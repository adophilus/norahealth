import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { DailyMealPlan } from '@nora-health/domain'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { UnexpectedError } from '../common'

export class GetWeeklyPlanPathParams extends Schema.Class<GetWeeklyPlanPathParams>(
  'GetWeeklyPlanPathParams'
)({
  start_date: Schema.String,
  end_date: Schema.String
}) {}

export class WeeklyPlanResponse extends Schema.Class<WeeklyPlanResponse>(
  'WeeklyPlanResponse'
)({
  daily_plans: Schema.Array(DailyMealPlan),
  start_date: Schema.String,
  end_date: Schema.String
}) {}

const GetWeeklyPlanEndpoint = HttpApiEndpoint.get(
  'getWeeklyPlan',
  '/daily-meal-plan/weekly/:start_date/:end_date'
)
  .setPath(GetWeeklyPlanPathParams)
  .addSuccess(WeeklyPlanResponse, { status: StatusCodes.OK })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(
    OpenApi.Description,
    'Get weekly meal plan for the specified date range'
  )

export default GetWeeklyPlanEndpoint
