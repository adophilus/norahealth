import { Data } from 'effect'

export class DailyWorkoutPlanRepositoryError extends Data.TaggedError(
  'DailyWorkoutPlanRepositoryError'
)<{
  message: string
  cause?: unknown
}> {}

export class DailyWorkoutPlanRepositoryNotFoundError extends Data.TaggedError(
  'DailyWorkoutPlanRepositoryNotFoundError'
)<{
  cause?: unknown
}> {}
