import { Data } from 'effect'

export class DailyMealPlanRepositoryError extends Data.TaggedError(
  'DailyMealPlanRepositoryError'
)<{
  message: string
  cause?: unknown
}> {}
