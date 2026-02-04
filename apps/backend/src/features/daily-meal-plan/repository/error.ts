import { Data } from 'effect'

export class DailyMealPlanRepositoryError extends Data.TaggedError(
  'DailyMealPlanRepositoryError'
)<{
  message: string
  cause?: unknown
}> {}

export class DailyMealPlanRepositoryNotFoundError extends Data.TaggedError(
  'DailyMealPlanRepositoryNotFoundError'
)<{ cause?: unknown }> {}
