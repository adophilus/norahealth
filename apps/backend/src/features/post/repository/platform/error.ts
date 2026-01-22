import { Data } from 'effect'

export class PostPlatformRepositoryError extends Data.TaggedError(
  'PostPlatformRepositoryError'
)<{
  message: string
  cause?: unknown
}> {}
