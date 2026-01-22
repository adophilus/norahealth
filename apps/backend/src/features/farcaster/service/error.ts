import { Data } from 'effect'

export class FarcasterServiceError extends Data.TaggedError(
  'FarcasterServiceError'
)<{
  message: string
  cause?: unknown
}> {}
