import { Data } from 'effect'

export class WorkoutSessionRepositoryError extends Data.TaggedError(
  'WorkoutSessionRepositoryError'
)<{
  message: string
  cause?: unknown
}> {}

export class WorkoutSessionRepositoryNotFoundError extends Data.TaggedError(
  'WorkoutSessionRepositoryNotFoundError'
)<{
  cause?: unknown
}> {}
