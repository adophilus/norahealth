import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { DailyMealPlan } from '@nora-health/domain'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { EmptyMessage, UnexpectedError } from '../common'

export class GenerateWeeklyPlanRequestBody extends Schema.Class<GenerateWeeklyPlanRequestBody>(
  'GenerateWeeklyPlanRequestBody'
)({
  start_date: Schema.String
}) {}

export class WeeklyPlanResponse extends Schema.Class<WeeklyPlanResponse>(
  'WeeklyPlanResponse'
)({
  daily_plans: Schema.Array(DailyMealPlan),
  start_date: Schema.String,
  end_date: Schema.String
}) {}

const GenerateWeeklyPlanEndpoint = HttpApiEndpoint.post(
  'generateWeeklyPlan',
  '/daily-meal-plan/weekly/generate'
)
  .setPayload(GenerateWeeklyPlanRequestBody)
  .addSuccess(WeeklyPlanResponse, { status: StatusCodes.CREATED })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(
    OpenApi.Description,
    'Generate a weekly meal plan starting from the specified date'
  )

export default GenerateWeeklyPlanEndpoint
