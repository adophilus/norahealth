import { Data } from 'effect'

export class WorkoutServiceError extends Data.TaggedError(
  'WorkoutServiceError'
)<{
  message: string
  cause?: unknown
}> {}

export class WorkoutServiceNotFoundError extends Data.TaggedError(
  'WorkoutServiceNotFoundError'
)<{
  cause?: unknown
}> {}

export class WorkoutServiceValidationError extends Data.TaggedError(
  'WorkoutServiceValidationError'
)<{
  message: string
  field: string
}> {}
