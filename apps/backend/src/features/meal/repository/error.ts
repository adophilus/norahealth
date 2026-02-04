import { Data } from 'effect'

export class MealRepositoryError extends Data.TaggedError(
  'MealRepositoryError'
)<{
  message: string
  cause?: unknown
}> {}

export class MealRepositoryNotFoundError extends Data.TaggedError(
  'MealRepositoryNotFoundError'
)<{
  cause?: unknown
}> {}
