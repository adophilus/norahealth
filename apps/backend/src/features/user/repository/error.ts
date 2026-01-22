import { Data } from 'effect'

export class UserRepositoryError extends Data.TaggedError(
  'UserRepositoryError'
)<{
  message: string
  cause?: unknown
}> {}

export class UserRepositoryNotFoundError extends Data.TaggedError(
  'UserRepositoryNotFoundError'
)<{
  message: string
  cause?: unknown
}> {}

export class UserRepositoryEmailAlreadyInUseError extends Data.TaggedError(
  // Added
  'UserRepositoryEmailAlreadyInUseError'
)<{
  email: string
}> {}

export class UserRepositoryPhoneNumberAlreadyInUseError extends Data.TaggedError(
  // Added
  'UserRepositoryPhoneNumberAlreadyInUseError'
)<{ phone_number: string }> {}

export type UserRepositoryOperationError =
  | UserRepositoryError
  | UserRepositoryNotFoundError
  | UserRepositoryEmailAlreadyInUseError // Added
  | UserRepositoryPhoneNumberAlreadyInUseError // Added
