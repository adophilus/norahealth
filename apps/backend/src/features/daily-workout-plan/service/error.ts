import { Data } from 'effect'

export class DailyWorkoutPlanServiceError extends Data.TaggedError(
  'DailyWorkoutPlanServiceError'
)<{
  message: string
  cause?: unknown
}> {}

export class DailyWorkoutPlanServiceNotFoundError extends Data.TaggedError(
  'DailyWorkoutPlanServiceNotFoundError'
)<{
  cause?: unknown
}> {}

export class DailyWorkoutPlanServiceValidationError extends Data.TaggedError(
  'DailyWorkoutPlanServiceValidationError'
)<{
  message: string
  cause?: unknown
}> {}
