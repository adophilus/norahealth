import { Data } from 'effect'

export class AuthTokenServiceError extends Data.TaggedError(
  'AuthTokenServiceError'
)<{
  message: string
  cause?: unknown
}> {}

export class AuthTokenServiceInvalidTokenError extends Data.TaggedError(
  'AuthTokenServiceInvalidTokenError'
)<{
  cause?: unknown
}> {}

export class AuthTokenServiceTokenExpiredError extends Data.TaggedError(
  'AuthTokenServiceTokenExpiredError'
)<{
  cause?: unknown
}> {}

export class AuthTokenServiceTokenNotExpiredError extends Data.TaggedError(
  'AuthTokenServiceTokenNotExpiredError'
)<{
  expires_at: number
  cause?: unknown
}> {}

export type AuthTokenServiceOperationError =
  | AuthTokenServiceError
  | AuthTokenServiceInvalidTokenError
  | AuthTokenServiceTokenExpiredError
  | AuthTokenServiceTokenNotExpiredError

