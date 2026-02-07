import { HttpApiEndpoint, OpenApi } from '@effect/platform'
import { DailyMealPlan } from '@nora-health/domain'
import { Schema } from 'effect'
import { StatusCodes } from 'http-status-codes'
import { EmptyMessage, UnexpectedError } from '../common'

export class UpdateDayPlanPathParams extends Schema.Class<UpdateDayPlanPathParams>(
  'UpdateDayPlanPathParams'
)({
  date: Schema.String
}) {}

export class UpdateDayPlanRequestBody extends Schema.Class<UpdateDayPlanRequestBody>(
  'UpdateDayPlanRequestBody'
)({
  breakfast: Schema.NullOr(Schema.String),
  lunch: Schema.NullOr(Schema.String),
  dinner: Schema.NullOr(Schema.String),
  snacks: Schema.Array(Schema.String),
  notes: Schema.String
}) {}

const UpdateDayPlanEndpoint = HttpApiEndpoint.put(
  'updateDayPlan',
  '/daily-meal-plan/day/:date'
)
  .setPath(UpdateDayPlanPathParams)
  .setPayload(UpdateDayPlanRequestBody)
  .addSuccess(EmptyMessage, { status: StatusCodes.NO_CONTENT })
  .addError(UnexpectedError, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  .annotate(OpenApi.Description, "Update a specific day's meal plan")

export default UpdateDayPlanEndpoint
