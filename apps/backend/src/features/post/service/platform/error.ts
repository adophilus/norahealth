import { Data } from 'effect'

export class PostPlatformServiceError extends Data.TaggedError(
  'PostPlatformServiceError'
)<{
  message: string
  cause?: unknown
}> {}

export class PostPlatformServiceNotFoundError extends Data.TaggedError(
  'PostPlatformServiceNotFoundError'
)<{
  message?: string
  cause?: unknown
}> {}
