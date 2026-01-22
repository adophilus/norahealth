import { Data } from 'effect'

export class PostRepositoryError extends Data.TaggedError(
  'PostRepositoryError'
)<{
  message: string
  cause?: unknown
}> {}
