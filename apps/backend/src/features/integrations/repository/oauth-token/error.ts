import { Data } from 'effect'

export class OAuthTokenRepositoryError extends Data.TaggedError(
  'OAuthTokenRepositoryError'
)<{
  message: string
  cause?: unknown
}> {}

export class OAuthTokenNotFoundError extends Data.TaggedError(
  'OAuthTokenNotFoundError'
)<{
  message: string
  cause?: unknown
}> {}
