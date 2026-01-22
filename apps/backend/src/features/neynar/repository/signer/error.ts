import { Data } from 'effect'

export class NeynarSignerRepositoryError extends Data.TaggedError(
  'NeynarSignerRepositoryError'
)<{
  message: string
  cause?: unknown
}> {}
