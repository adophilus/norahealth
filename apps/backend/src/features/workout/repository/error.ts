import { Data } from 'effect'

export class WorkoutRepositoryError extends Data.TaggedError(
  'WorkoutRepositoryError'
)<{
  message: string
  cause?: unknown
}> {}

export class WorkoutRepositoryNotFoundError extends Data.TaggedError(
  'WorkoutRepositoryNotFoundError'
)<{
  cause?: unknown
}> {}
