import { Data } from 'effect'

export class FacebookOAuthServiceError extends Data.TaggedError(
  'FacebookOAuthServiceError'
)<{
  message: string
  cause?: unknown
}> {}
