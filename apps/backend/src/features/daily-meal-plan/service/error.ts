import { Data } from 'effect'

export class DailyMealPlanServiceError extends Data.TaggedError(
  'DailyMealPlanServiceError'
)<{
  message: string
  cause?: unknown
}> {}

export class DailyMealPlanServiceNoMealsFoundError extends Data.TaggedError(
  'DailyMealPlanServiceNoMealsFoundError'
)<{
  cause?: unknown
}> {}
