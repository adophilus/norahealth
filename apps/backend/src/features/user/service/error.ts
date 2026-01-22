import { Data } from 'effect'

export class UserServiceError extends Data.TaggedError('UserServiceError')<{
  message: string
  cause?: unknown
}> {}

export class UserServiceNotFoundError extends Data.TaggedError(
  'UserServiceNotFoundError'
)<{
  cause?: unknown
}> {}

export class UserServiceEmailAlreadyInUseError extends Data.TaggedError(
  // Added
  'UserServiceEmailAlreadyInUseError'
)<{
  message: string
  cause?: unknown
}> {}

export class UserServicePhoneNumberAlreadyInUseError extends Data.TaggedError(
  // Added
  'UserServicePhoneNumberAlreadyInUseError'
)<{
  message: string
  cause?: unknown
}> {}

export type UserServiceOperationError =
  | UserServiceError
  | UserServiceNotFoundError
  | UserServiceEmailAlreadyInUseError // Added
  | UserServicePhoneNumberAlreadyInUseError // Added
