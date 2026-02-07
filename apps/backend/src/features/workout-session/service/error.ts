import { Data } from 'effect'

export class WorkoutSessionServiceError extends Data.TaggedError(
  'WorkoutSessionServiceError'
)<{
  message: string
  cause?: unknown
}> {}

export class WorkoutSessionServiceNotFoundError extends Data.TaggedError(
  'WorkoutSessionServiceNotFoundError'
)<{
  cause?: unknown
}> {}
