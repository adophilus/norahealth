import { Data } from 'effect'

export class WaitlistRepositoryError extends Data.TaggedError(
  'WaitlistRepositoryError'
)<{
  message: string
  cause?: unknown
}> {}
