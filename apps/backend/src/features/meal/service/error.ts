import { Data } from 'effect'

export class MealServiceError extends Data.TaggedError('MealServiceError')<{
  message: string
  cause?: unknown
}> {}

export class MealServiceNotFoundError extends Data.TaggedError(
  'MealServiceNotFoundError'
)<{
  cause?: unknown
}> {}

export class MealServiceValidationError extends Data.TaggedError(
  'MealServiceValidationError'
)<{
  message: string
  field: string
}> {}
