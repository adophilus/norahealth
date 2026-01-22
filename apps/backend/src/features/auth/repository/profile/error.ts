import { Data } from 'effect'

export class AuthProfileRepositoryError extends Data.TaggedError(
  'AuthProfileRepositoryError'
)<{
  message: string
  cause?: unknown
}> {}

export type AuthProfileRepositoryOperationError = AuthProfileRepositoryError
