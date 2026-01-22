import { Data } from 'effect'

export class NeynarServiceSignerNotFoundError extends Data.TaggedError(
  'NeynarServiceSignerNotFoundError'
)<{
  cause?: unknown
}> {}

export class NeynarServiceError extends Data.TaggedError('NeynarServiceError')<{
  message: string
  cause?: unknown
}> {}
