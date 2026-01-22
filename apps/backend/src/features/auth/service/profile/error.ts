import { Data } from 'effect'

export class AuthProfileServiceError extends Data.TaggedError(
  'AuthProfileServiceError'
)<{
  message: string
  cause?: unknown
}> {}

export class AuthProfileServiceNotFoundError extends Data.TaggedError(
  'AuthProfileServiceNotFoundError'
)<{ cause?: unknown }> {}

export class AuthProfileServiceAlreadyExistsError extends Data.TaggedError(
  'AuthProfileServiceAlreadyExistsError'
)<{
  message: string
  cause?: unknown
}> {}
