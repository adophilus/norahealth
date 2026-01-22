import { Data } from 'effect'

export class PostServiceError extends Data.TaggedError('PostServiceError')<{
  message: string
  cause?: unknown
}> {}

export class PostServiceNotFoundError extends Data.TaggedError(
  'PostServiceNotFoundError'
)<{
  message?: string
  cause?: unknown
}> {}
